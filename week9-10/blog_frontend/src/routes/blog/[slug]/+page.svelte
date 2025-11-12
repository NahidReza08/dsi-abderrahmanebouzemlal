

	<script>
  import { blogPosts } from '$lib/data/data.svelte.js';
  import TrendingPost from '$lib/components/TrendingPost.svelte';
	let { data } = $props();
  const { post } = data;
  const formattedDate = new Date(post.publish_date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const relatedPosts = blogPosts.blog_posts
    .filter(p => p.category === post.category && p.id !== post.id)
    .slice(0, 3);

  const author = blogPosts.authors.find(a => a.name === post.author.name);
</script>

<svelte:head>
  <title>{post.title} — La Plume</title>
  <meta name="description" content={post.description} />
  <meta property="og:title" content={post.title} />
  <meta property="og:description" content={post.description} />
  <meta property="og:image" content={post.article_photo} />
  <meta property="og:type" content="article" />
</svelte:head>

<article class="max-w-7xl mx-auto px-4 py-16 font-body">
  <nav class="text-sm text-gray-500 mb-8">
    <a href="/" class="hover:text-gray-700">Home</a>
    <span class="mx-2">/</span>
    <a href="/blog" class="hover:text-gray-700">Blog</a>
    <span class="mx-2">/</span>
    <span class="text-gray-900">{post.title}</span>
  </nav>

  <div class="grid lg:grid-cols-3 gap-12">
    <div class="lg:col-span-2">
      <header class="mb-10">
        <h1 class="font-header font-bold text-4xl sm:text-5xl lg:text-6xl leading-tight text-gray-900 mb-6">
          {post.title}
        </h1>

        <div class="flex flex-wrap items-center gap-4 text-sm text-gray-600">
          <div class="flex items-center gap-2">
            <img
              src={post.author.picture}
              alt={post.author.name}
              class="w-10 h-10 rounded-full object-cover"
            />
            <span class="font-medium text-gray-900">{post.author.name}</span>
          </div>
          <span>•</span>
          <time>{formattedDate}</time>
          <span>•</span>
          <span>{post.read_time_minutes} min read</span>
          {#if post.featured}
            <span class="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              Featured
            </span>
          {/if}
        </div>
      </header>

      <!-- Featured Image -->
      <img
        src={post.article_photo}
        alt={post.title}
        class="w-full h-auto rounded-xl mb-10 object-cover shadow-lg"
      />

      <div class="prose prose-lg max-w-none text-gray-700 mb-12">
        <p class="lead text-xl text-gray-800 mb-6">
          {post.description}
        </p>
        <p>
          This is where the full article content would go. You can paste your Markdown-rendered HTML here,
          or use a CMS integration like Contentful, Sanity, or Markdown files.
        </p>
        <p>
          For now, this is a <strong>styled placeholder</strong> matching your design system.
        </p>
				In recent years, the Internet of Things (IoT) has revolutionized the way we live and work. IoT devices, from smart homes to self-driven cars, are becoming increasingly common in our daily lives. However, this growing network of connected devices also presents a significant cybersecurity risk. In this blog, we will explore the challenges and solutions of cybersecurity in the age of IoT for students and professionals, using statistics to illustrate the scale of the problem.

Challenges:

    Lack of security standards: The lack of universally accepted security standards is a significant challenge in IoT device security. This lack of trust is partly due to the inconsistent security protocols used by different IoT devices, which makes it challenging to develop a comprehensive security framework.
    DDoS attacks: IoT devices are vulnerable to Distributed Denial of Service (DDoS) attacks, which can cause significant disruption and downtime. In 2016, the Mirai botnet, composed of compromised IoT devices, launched a massive DDoS attack on Dyn, a central domain name system (DNS) provider, which disrupted access to popular websites such as Airbnb, Twitter, BBC, Amazon, HBO, and Netflix. This attack was one of the largest and most sophisticated DDoS attacks to date, illustrating the significant threat that IoT devices pose.
    Data privacy: IoT devices collect and store vast amounts of personal and sensitive data, which can be used for disreputable objectives if not properly secured. This data can be used for miscellaneous objectives, including identity theft, blackmail, and extortion.
    Physical security: IoT devices are often deployed in remote locations or harsh environments, making them vulnerable to physical attacks such as theft or sabotage. For example, a smart meter in the UK was targeted by thieves, who stole it and sold it on the black market. This highlights the importance of physical security for IoT devices.

 Solutions:

    Strong authentication and encryption: IoT devices should be protected with strong authentication and encryption protocols to prevent unauthorized access. This highlights the growing importance of strong authentication for IoT device security.
    Network segmentation: Internet of Things devices should be isolated from other devices on the network using network segmentation. This makes it more difficult for hackers to move laterally through the network.

    Regular software updates: IoT devices should be updated with the latest software and security patches.

    Risk assessment and management: Students and professionals should regularly assess and manage the risks associated with IoT devices.

    Security by design: IoT devices should be designed with security in mind from the outset. Security by design ensures that security is an integral part of the device rather than an afterthought, making it more resilient to cyber-attacks.

The growing number of Internet of Things devices presents significant cybersecurity challenges for students and professionals alike. However, by implementing strong authentication and encryption, network segmentation, regular software updates, risk assessment and management, and security by design, we can mitigate these risks and ensure that IoT devices are more secure. As the IoT continues to evolve, staying up-to-date with the latest security practices and technologies is essential to protect ourselves and our devices from cyber threats.

EC-Council University can help students and professionals with cybersecurity in the age of IoT by offering degree programs and certifications that focus on the latest technologies and best practices in the field. The EC-Council University’s Bachelor of Science in Cyber Security program covers topics such as secure coding, network security, and digital forensics, while this degree is embedded with industry certifications providing training in the latest tools and techniques used by hackers. Another course is the Master of Science in Cybersecurity, which focuses on advanced cybersecurity concepts such as threat intelligence, penetration testing, and digital forensics. This program is designed for students who wish to specialize in cybersecurity and gain an in-depth understanding of the latest trends and techniques in the field. Both of these courses can provide students with the knowledge and skills needed to tackle the challenges posed by IoT-related cybersecurity threats.
      </div>

      <!-- Tags -->
      <div class="flex flex-wrap gap-2 mb-10">
        {#each post.tags as tag (tag)}
          <span class="bg-gray-100 text-gray-700 text-sm font-medium px-3 py-1 rounded-full">
            #{tag}
          </span>
        {/each}
      </div>

      <!-- Author Bio -->
      {#if author}
        <div class="border-t pt-8 mt-12">
          <div class="flex gap-4">
            <img
              src={post.author.picture}
              alt={author.name}
              class="w-16 h-16 rounded-full object-cover flex-shrink-0"
            />
            <div>
              <h3 class="font-semibold text-lg text-gray-900">{author.name}</h3>
              <p class="text-gray-600 text-sm">{author.bio}</p>
            </div>
          </div>
        </div>
      {/if}

      <!-- Back to Blog -->
      <div class="mt-12">
        <a
          href="/blog"
          class="inline-flex items-center gap-2 text-blue-600 font-medium hover:text-blue-800 transition"
        >
          ← Back to all articles
        </a>
      </div>
    </div>

    <!-- Sidebar -->
    <aside class="lg:col-span-1">
      <div class="sticky top-24 space-y-12">
        <!-- Trending -->
        <div>
          <h2 class="font-header font-bold text-2xl text-gray-900 mb-6">Trending Now</h2>
          <TrendingPost featuredPosts={blogPosts.blog_posts.filter(p => p.featured)} />
        </div>

        <!-- Related Posts -->
        {#if relatedPosts.length > 0}
          <div>
            <h2 class="font-header font-bold text-2xl text-gray-900 mb-6">Related Articles</h2>
            <div class="space-y-6">
              {#each relatedPosts as related (related.id)}
                <a href="/blog/{related.id}" class="block group">
                  <div class="flex gap-3">
                    <img
                      src={related.article_photo}
                      alt={related.title}
                      class="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                    />
                    <div>
                      <h3 class="font-medium text-gray-900 group-hover:text-blue-600 line-clamp-2 text-sm">
                        {related.title}
                      </h3>
                      <p class="text-xs text-gray-500 mt-1">{related.read_time_minutes} min read</p>
                    </div>
                  </div>
                </a>
              {/each}
            </div>
          </div>
        {/if}
      </div>
    </aside>
  </div>
</article>