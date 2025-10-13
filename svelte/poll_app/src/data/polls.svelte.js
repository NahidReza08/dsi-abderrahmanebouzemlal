//@ts-nocheck
import { derived, writable, readonly, get } from 'svelte/store';
import { v4 as uuidv4 } from 'uuid';

const CookieManager = {
  set(name, value, days = 365) {
    if (typeof document === 'undefined') return;
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/;SameSite=Strict`;
  },

  get(name) {
    if (typeof document === 'undefined') return null;
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  },

  delete(name) {
    if (typeof document === 'undefined') return;
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  }
};

function generateUserId() {
  return `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

function getAnonymousUserId() {
  let userId = CookieManager.get('anonymous_user_id');
  if (!userId) {
    userId = generateUserId();
    CookieManager.set('anonymous_user_id', userId, 365);
  }
  return userId;
}

const userVotesStore = writable({});

function initializeUserVotes() {
  const votesData = CookieManager.get('user_votes');
  if (votesData) {
    try {
      const votes = JSON.parse(decodeURIComponent(votesData));
      userVotesStore.set(votes);
    } catch (e) {
      console.error('Failed to parse user votes:', e);
    }
  }
}

function saveUserVotes(votes) {
  const votesString = encodeURIComponent(JSON.stringify(votes));
  CookieManager.set('user_votes', votesString, 365);
}

if (typeof document !== 'undefined') {
  initializeUserVotes();
}

export const userVotes = readonly(userVotesStore);

const pollStore = writable([
  {
    id: uuidv4(),
    question: 'What is your favorite programming language?',
    type: 'single',
    options: [
      { id: 1, text: 'JavaScript', votes: 10 },
      { id: 2, text: 'Python', votes: 15 },
      { id: 3, text: 'Java', votes: 16 },
      { id: 4, text: 'C#', votes: 3 }
    ]
  },
  {
    id: uuidv4(),
    question: 'What is your preferred development environment?',
    type: 'single',
    options: [
      { id: 1, text: 'VS Code', votes: 20 },
      { id: 2, text: 'IntelliJ', votes: 8 },
      { id: 3, text: 'Sublime Text', votes: 4 },
      { id: 4, text: 'Vim', votes: 2 }
    ]
  },
  {
    id: uuidv4(),
    question: 'Which frontend framework do you use the most?',
    type: 'single',
    options: [
      { id: 1, text: 'React', votes: 2093 },
      { id: 2, text: 'Vue', votes: 100 },
      { id: 3, text: 'Angular', votes: 5100 },
      { id: 4, text: 'Svelte', votes: 347 }
    ]
  },
  {
    id: uuidv4(),
    question: 'What is your favorite database?',
    type: 'single',
    options: [
      { id: 1, text: 'MySQL', votes: 12 },
      { id: 2, text: 'PostgreSQL', votes: 19 },
      { id: 3, text: 'MongoDB', votes: 7 },
      { id: 4, text: 'SQLite', votes: 1 }
    ]
  }
]);

export const polls = derived(pollStore, ($polls) => {
  return $polls.map((poll) => ({
    ...poll,
    totalVotes: poll.options.reduce((sum, option) => sum + option.votes, 0)
  }));
});

export const pollActions = {
  addPoll: (question, options, pollType) => {
    pollStore.update((polls) => {
      const newId = uuidv4();
      const newPoll = {
        id: newId,
        question,
        type: pollType,
        options: options.map((text, index) => ({
          id: index + 1,
          text,
          votes: 0
        }))
      };
      return [...polls, newPoll];
    });
  },

  removePoll: (id) => {
    pollStore.update((polls) => polls.filter((poll) => poll.id !== id));

    userVotesStore.update((votes) => {
      const { [id]: removed, ...rest } = votes;
      saveUserVotes(rest);
      return rest;
    });
  },

  canVote: (pollId) => {
    const votes = get(userVotesStore);
    return !votes.hasOwnProperty(pollId);
  },

  vote: (pollId, optionId) => {
    const votes = get(userVotesStore);

    if (votes.hasOwnProperty(pollId)) {
      console.warn('User has already voted on this poll. Use changeVote to update.');
      throw new Error('You have already voted on this poll.');
    }


    pollStore.update((polls) => {
      return polls.map((poll) => {
        if (poll.id === pollId) {
          return {
            ...poll,
            options: poll.options.map((option) => {
              if (optionId && Array.isArray(optionId)) {
                if (optionId.includes(option.id)) {
                  return { ...option, votes: option.votes + 1 };
                }
              } else if (option.id === optionId) {
                return { ...option, votes: option.votes + 1 };
              }
              return option;
            })
          };
        }
        return poll;
      });
    });

    const updatedVotes = { ...votes, [pollId]: optionId };
    userVotesStore.set(updatedVotes);
    saveUserVotes(updatedVotes);

  },

  changeVote: (pollId, newOptionId) => {
    const votes = get(userVotesStore);
    const oldOptionId = votes[pollId];

    if (!oldOptionId) {
      console.warn('No existing vote found. Use vote() instead.');
      throw new Error('You have not voted on this poll yet.');
    }

    if (JSON.stringify(oldOptionId) === JSON.stringify(newOptionId)) {
      return false;
    }


    pollStore.update((polls) => {
      return polls.map((poll) => {
        if (poll.id === pollId) {
          return {
            ...poll,
            options: poll.options.map((option) => {
              if (Array.isArray(oldOptionId) && Array.isArray(newOptionId)) {
                if (oldOptionId.includes(option.id) && !newOptionId.includes(option.id)) {
                  return { ...option, votes: Math.max(0, option.votes - 1) };
                }
                if (!oldOptionId.includes(option.id) && newOptionId.includes(option.id)) {
                  return { ...option, votes: option.votes + 1 };
                }
              } else {
                if (option.id === oldOptionId) {
                  return { ...option, votes: Math.max(0, option.votes - 1) };
                }
                if (option.id === newOptionId) {
                  return { ...option, votes: option.votes + 1 };
                }
              }
              return option;
            })
          };
        }
        return poll;
      });
    });

    const updatedVotes = { ...votes, [pollId]: newOptionId };
    userVotesStore.set(updatedVotes);
    saveUserVotes(updatedVotes);

    return true;
  },

  unvote: (pollId, optionId) => {

    pollStore.update((polls) => {
      return polls.map((poll) => {
        if (poll.id === pollId) {
          return {
            ...poll,
            options: poll.options.map((option) => {
              if (optionId && Array.isArray(optionId)) {
                if (optionId.includes(option.id)) {
                  return { ...option, votes: Math.max(0, option.votes - 1) };
                }
              } else if (option.id === optionId) {
                return { ...option, votes: Math.max(0, option.votes - 1) };
              }
              return option;
            })
          };
        }
        return poll;
      });
    });

    userVotesStore.update((votes) => {
      const { [pollId]: removed, ...rest } = votes;
      saveUserVotes(rest);
      return rest;
    });
  },

  getPollById: (pollId) => {
    return derived(polls, ($polls) => {
      return $polls.find((poll) => poll.id === pollId) || null;
    });
  },

  orderByVotes: () => {
    pollStore.update((polls) => {
      return [...polls].sort((a, b) => {
        const totalVotesA = a.options.reduce((sum, option) => sum + option.votes, 0);
        const totalVotesB = b.options.reduce((sum, option) => sum + option.votes, 0);
        return totalVotesB - totalVotesA;
      });
    });
  },

  deletePoll: (pollId) => {
    pollStore.update((polls) => polls.filter((poll) => poll.id !== pollId));

    userVotesStore.update((votes) => {
      const { [pollId]: removed, ...rest } = votes;
      saveUserVotes(rest);
      return rest;
    });
  },

  pushToEnd: (pollId) => {
    pollStore.update((polls) => {
      const index = polls.findIndex((poll) => poll.id === pollId);
      if (index === -1) return polls;
      const pollsCopy = [...polls];
      const [poll] = pollsCopy.splice(index, 1);
      return [...pollsCopy, poll];
    });
  },

  progressOptions: (pollId) => {
    return derived(polls, ($polls) => {
      const poll = $polls.find((p) => p.id === pollId);
      if (!poll) return [];
      const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);
      return poll.options.map((option) => ({
        ...option,
        progress: totalVotes > 0 ? option.votes / totalVotes : 0,
        percentage: totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0
      }));
    });
  },

  resetUserVotes: () => {
    userVotesStore.set({});
    CookieManager.delete('user_votes');
  },

  getAnonymousUserId,

  getUserVote: (pollId) => {
    const votes = get(userVotesStore);
    return votes[pollId] || null;
  },

  hasVoted: (pollId) => {
    const votes = get(userVotesStore);
    return votes.hasOwnProperty(pollId);
  }
};
