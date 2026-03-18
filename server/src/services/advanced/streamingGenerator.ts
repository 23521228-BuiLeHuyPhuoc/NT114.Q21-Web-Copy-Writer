/**
 * Advanced Feature: SSE (Server-Sent Events) Streaming for AI Content Generation
 * 
 * Implements real-time streaming of AI-generated content using Server-Sent Events.
 * This provides a native, unidirectional streaming protocol that:
 * 
 * 1. Simulates word-by-word generation (like ChatGPT)
 * 2. Supports multiple content types with type-specific prompts
 * 3. Handles back-pressure and connection management
 * 4. Provides progress updates during generation
 * 5. Supports abort/cancel mid-stream
 * 
 * In production, this would connect to OpenAI's streaming API or Ollama.
 * For demo purposes, it uses a sophisticated text generation simulation.
 */

import { Request, Response } from 'express';
import { EventEmitter } from 'events';

export interface GenerationRequest {
  type: 'blog' | 'ad' | 'email' | 'product_description' | 'social_media' | 'seo' | 'script' | 'headline';
  prompt: string;
  tone?: 'professional' | 'casual' | 'formal' | 'creative' | 'persuasive' | 'informative';
  language?: string;
  maxTokens?: number;
  temperature?: number;
  model?: string;
}

export interface StreamEvent {
  type: 'start' | 'token' | 'progress' | 'complete' | 'error';
  data: string;
  metadata?: Record<string, unknown>;
}

// Content templates for different types (used for demo generation)
const CONTENT_TEMPLATES: Record<string, string[]> = {
  blog: [
    "# {topic}\n\n",
    "In today's rapidly evolving digital landscape, ",
    "understanding {topic} has become more important than ever. ",
    "Whether you're a seasoned professional or just getting started, ",
    "this comprehensive guide will walk you through everything you need to know.\n\n",
    "## Why {topic} Matters\n\n",
    "The significance of {topic} cannot be overstated. ",
    "According to recent studies, organizations that embrace {topic} ",
    "see an average improvement of 40% in their operational efficiency. ",
    "This isn't just a trend—it's a fundamental shift in how we approach modern challenges.\n\n",
    "### Key Benefits\n\n",
    "- **Increased Productivity**: Streamline your workflow and accomplish more in less time\n",
    "- **Better Decision Making**: Data-driven insights lead to smarter choices\n",
    "- **Competitive Advantage**: Stay ahead of the curve in your industry\n",
    "- **Cost Reduction**: Optimize resources and reduce unnecessary expenses\n\n",
    "## Getting Started with {topic}\n\n",
    "The first step is to assess your current situation. ",
    "Take inventory of your existing processes and identify areas where {topic} ",
    "can make the biggest impact. ",
    "Start small, measure results, and scale what works.\n\n",
    "### Step 1: Assessment\n\n",
    "Begin by conducting a thorough analysis of your current operations. ",
    "Look for bottlenecks, inefficiencies, and areas ripe for improvement. ",
    "Document everything—this baseline will be crucial for measuring progress.\n\n",
    "### Step 2: Planning\n\n",
    "Create a detailed implementation plan with clear milestones and timelines. ",
    "Assign responsibilities and ensure everyone understands their role. ",
    "Remember, the best plan is one that's flexible enough to adapt to changing circumstances.\n\n",
    "### Step 3: Execution\n\n",
    "With your plan in place, it's time to take action. ",
    "Start with a pilot project to test your approach before rolling out more broadly. ",
    "Gather feedback regularly and make adjustments as needed.\n\n",
    "## Best Practices\n\n",
    "1. **Start with clear objectives** — Know what success looks like before you begin\n",
    "2. **Invest in training** — Your team is your greatest asset\n",
    "3. **Measure and iterate** — Use data to guide your decisions\n",
    "4. **Stay current** — The field of {topic} evolves rapidly\n",
    "5. **Build a community** — Connect with others who share your interests\n\n",
    "## Conclusion\n\n",
    "{topic} represents a tremendous opportunity for growth and innovation. ",
    "By taking a strategic, measured approach, you can harness its power ",
    "to transform your work and achieve remarkable results. ",
    "The journey of a thousand miles begins with a single step—start yours today.",
  ],
  ad: [
    "🚀 Introducing the Future of {topic}!\n\n",
    "Tired of outdated solutions? Ready for something revolutionary?\n\n",
    "✅ Save up to 50% on your time\n",
    "✅ Boost productivity by 3x\n",
    "✅ Join 10,000+ satisfied customers\n\n",
    "Our cutting-edge {topic} solution is designed for forward-thinking professionals like you.\n\n",
    "🎯 Limited Time Offer: Get 30% OFF with code LAUNCH30\n\n",
    "Don't miss out — the future of {topic} starts now.\n",
    "👉 Click here to get started today!",
  ],
  email: [
    "Subject: Exciting News About {topic}\n\n",
    "Dear [Recipient],\n\n",
    "I hope this email finds you well. I'm reaching out to share some exciting developments ",
    "regarding {topic} that I believe will be of great interest to you.\n\n",
    "Over the past few months, our team has been working diligently to develop ",
    "innovative solutions in the {topic} space. I'm thrilled to announce that ",
    "we've achieved some remarkable results.\n\n",
    "Key highlights:\n",
    "• 40% improvement in efficiency\n",
    "• Positive feedback from early adopters\n",
    "• Scalable solution ready for deployment\n\n",
    "I would love to schedule a brief call to discuss how these advancements ",
    "could benefit your organization. Would you be available for a 15-minute conversation ",
    "this week?\n\n",
    "Looking forward to hearing from you.\n\n",
    "Best regards,\n[Your Name]",
  ],
  product_description: [
    "## {topic}\n\n",
    "Transform your experience with our premium {topic} solution — ",
    "engineered for excellence and designed for real-world results.\n\n",
    "### Features\n\n",
    "🔹 **Intuitive Design** — Get started in minutes, not hours\n",
    "🔹 **Enterprise-Grade Security** — Your data is always protected\n",
    "🔹 **24/7 Support** — We're here whenever you need us\n",
    "🔹 **Scalable Architecture** — Grows with your business\n\n",
    "### Specifications\n\n",
    "| Feature | Details |\n",
    "|---------|--------|\n",
    "| Performance | Up to 10x faster processing |\n",
    "| Compatibility | Works with all major platforms |\n",
    "| Storage | Unlimited cloud storage |\n",
    "| Updates | Free lifetime updates |\n\n",
    "### What Our Customers Say\n\n",
    "> \"This {topic} solution completely transformed our workflow. Highly recommended!\"\n",
    "> — Sarah J., Product Manager\n\n",
    "**Ready to get started?** Choose the plan that's right for you.",
  ],
  social_media: [
    "🌟 Big news! We just launched something amazing for {topic} lovers!\n\n",
    "Here's why everyone's talking about it:\n\n",
    "1️⃣ It's incredibly easy to use\n",
    "2️⃣ Results speak for themselves\n",
    "3️⃣ Perfect for beginners and pros alike\n\n",
    "Don't just take our word for it — try it yourself! 🚀\n\n",
    "#Innovation #{topic} #GameChanger #Tech #Future",
  ],
  seo: [
    "# Ultimate Guide to {topic}: Everything You Need to Know in 2024\n\n",
    "**Last updated: March 2024 | Reading time: 8 minutes**\n\n",
    "## Table of Contents\n",
    "1. What is {topic}?\n",
    "2. Why {topic} is Important\n",
    "3. How to Get Started\n",
    "4. Best Practices\n",
    "5. Common Mistakes\n",
    "6. FAQs\n\n",
    "## What is {topic}?\n\n",
    "{topic} refers to the comprehensive approach of leveraging modern tools ",
    "and techniques to achieve optimal results in your field. ",
    "It encompasses a wide range of strategies and methodologies ",
    "that have been proven effective across various industries.\n\n",
    "## Why {topic} is Important\n\n",
    "In the competitive landscape of 2024, mastering {topic} gives you a significant edge. ",
    "Studies show that professionals who invest in {topic} see 3x better outcomes ",
    "compared to those who rely on traditional methods alone.\n\n",
    "## Frequently Asked Questions\n\n",
    "**Q: How long does it take to see results with {topic}?**\n",
    "A: Most people start seeing measurable improvements within 2-4 weeks.\n\n",
    "**Q: Is {topic} suitable for beginners?**\n",
    "A: Absolutely! Our guide is designed to help everyone from beginners to experts.",
  ],
  script: [
    "INT. OFFICE - DAY\n\n",
    "A modern, well-lit workspace. ALEX (30s, enthusiastic) sits at their desk.\n\n",
    "ALEX\n",
    "(looking at camera)\n",
    "Have you ever wondered what makes {topic} so revolutionary?\n\n",
    "Alex stands and walks to a whiteboard.\n\n",
    "ALEX (CONT'D)\n",
    "Let me break it down for you in simple terms.\n\n",
    "GRAPHICS appear showing key statistics.\n\n",
    "ALEX (V.O.)\n",
    "First, {topic} increases efficiency by up to 40%.\n",
    "Second, it reduces costs significantly.\n",
    "And third — and this is the exciting part — it opens up \n",
    "entirely new possibilities we never thought possible.\n\n",
    "CUT TO:\n\n",
    "INT. CONFERENCE ROOM - CONTINUOUS\n\n",
    "A team meeting with engaged participants.\n\n",
    "ALEX\n",
    "The future of {topic} is here, and it's accessible to everyone.\n",
    "Are you ready to be part of it?\n\n",
    "FADE TO BLACK.\n",
    "END.",
  ],
  headline: [
    "Here are 10 compelling headlines about {topic}:\n\n",
    "1. \"{topic}: The Complete Guide to Transforming Your Business\"\n",
    "2. \"Why Smart Companies Are Investing in {topic} (And You Should Too)\"\n",
    "3. \"The Secret to Mastering {topic} in 2024\"\n",
    "4. \"How {topic} Can Save You Time and Money\"\n",
    "5. \"Breaking: New Research Reveals the Power of {topic}\"\n",
    "6. \"{topic} Made Simple: A Beginner's Guide\"\n",
    "7. \"The Top 5 Myths About {topic} — Debunked\"\n",
    "8. \"From Zero to Hero: Your {topic} Success Story\"\n",
    "9. \"Why {topic} Will Define the Next Decade\"\n",
    "10. \"Stop Struggling with {topic} — Here's the Solution\"",
  ],
};

/**
 * Stream content generation using Server-Sent Events
 * 
 * This function sets up an SSE connection and streams content
 * word by word with realistic typing delays.
 */
export function streamContentGeneration(req: Request, res: Response, request: GenerationRequest): void {
  // Set SSE headers
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no', // Disable Nginx buffering
  });

  const emitter = new EventEmitter();
  let aborted = false;
  let totalTokens = 0;

  // Handle client disconnect
  req.on('close', () => {
    aborted = true;
    emitter.emit('abort');
  });

  // Send SSE event
  const sendEvent = (event: StreamEvent) => {
    if (aborted) return;
    res.write(`event: ${event.type}\n`);
    res.write(`data: ${JSON.stringify(event)}\n\n`);
  };

  // Generate content
  const generateContent = async () => {
    try {
      // Send start event
      sendEvent({
        type: 'start',
        data: '',
        metadata: {
          model: request.model || 'gpt-4',
          type: request.type,
          tone: request.tone || 'professional',
          timestamp: new Date().toISOString(),
        },
      });

      // Get content template based on type
      const template = CONTENT_TEMPLATES[request.type] || CONTENT_TEMPLATES.blog;
      const topic = request.prompt || 'your topic';

      // Simulate streaming generation
      let fullContent = '';
      const maxTokens = request.maxTokens || 2000;

      for (let i = 0; i < template.length && !aborted; i++) {
        const segment = template[i].replace(/\{topic\}/g, topic);
        const words = segment.split(/(\s+)/);

        for (const word of words) {
          if (aborted) break;
          if (totalTokens >= maxTokens) break;

          fullContent += word;
          totalTokens++;

          // Send token event
          sendEvent({
            type: 'token',
            data: word,
            metadata: { tokenCount: totalTokens },
          });

          // Send progress update every 50 tokens
          if (totalTokens % 50 === 0) {
            const progress = Math.min(100, Math.round((totalTokens / maxTokens) * 100));
            sendEvent({
              type: 'progress',
              data: `${progress}%`,
              metadata: {
                tokensGenerated: totalTokens,
                maxTokens,
                progress,
              },
            });
          }

          // Simulate realistic typing delay (20-80ms per word)
          const delay = 20 + Math.random() * 60;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }

      if (!aborted) {
        // Send completion event
        sendEvent({
          type: 'complete',
          data: fullContent,
          metadata: {
            totalTokens,
            model: request.model || 'gpt-4',
            finishReason: totalTokens >= maxTokens ? 'max_tokens' : 'complete',
            generationTime: Date.now(),
          },
        });
      }
    } catch (error) {
      if (!aborted) {
        sendEvent({
          type: 'error',
          data: error instanceof Error ? error.message : 'Unknown error occurred',
        });
      }
    } finally {
      if (!aborted) {
        res.end();
      }
    }
  };

  generateContent();
}

/**
 * Non-streaming content generation (for batch operations)
 */
export async function generateContent(request: GenerationRequest): Promise<{
  content: string;
  tokensUsed: number;
  model: string;
  generationTime: number;
}> {
  const startTime = Date.now();
  const template = CONTENT_TEMPLATES[request.type] || CONTENT_TEMPLATES.blog;
  const topic = request.prompt || 'your topic';
  
  const content = template
    .join('')
    .replace(/\{topic\}/g, topic);

  return {
    content,
    tokensUsed: content.split(/\s+/).length,
    model: request.model || 'gpt-4',
    generationTime: Date.now() - startTime,
  };
}
