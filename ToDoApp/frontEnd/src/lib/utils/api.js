import axios from 'axios';
import { API_URL } from './constants';


class TodoApi {
  constructor(baseUrl) {
    this.client = axios.create({
      baseURL: baseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.response.use(
      (response) => response.data,
      (error) => {
        throw new Error(error.response?.data?.message || error.message || 'An error occurred');
      }
    );
  }

  async getAll() {
    return this.client.get('');
  }

  get(id) {
    return this.client.get(`/${id}`);
  }

  create(data) {
    return this.client.post('', data);
  }

  update(id, data) {
    return this.client.patch(`/${id}`, data);
  }

  reorder(id, newPosition) {
    return this.client.patch(`/${id}/reorder`,{
        method:"PATCH",
        body: { newPosition }
    });
  }

  delete(id) {
    return this.client.delete(`/${id}`);
  }
}

export const todoApi = new TodoApi(API_URL);