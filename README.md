# SBU~GO-MO 🚀

Your **personal wellness & event concierge** at Stony Brook.

## Inspiration

Getting involved at Stony Brook shouldn’t feel like a full-time job. With **hundreds of events happening every week**, students often feel overwhelmed, **not knowing what’s out there, when events are happening, or how to fit them into their busy schedules.**

As **E-Board members**, we’ve seen firsthand the gap between students interested in clubs at the Involvement Fair and the **low turnout at actual events.** Many organizations also struggle with unpredictable attendance, making it hard to plan effectively.

SBU~GO-MO was built to **eliminate the hassle** of searching for events and **promote student well-being** by:
💡 **Automatically recommending events that match your interests.**
📅 **Syncing events directly to your calendar based on availability.**
💙 **Encouraging mental & physical wellness through campus engagement.**

At its core, **this app is about wellness.** It’s about reducing decision fatigue, making social life easier, and ensuring students **find time to relax, connect, and thrive.**

## What It Does

SBU~GO-MO scrapes **SBEngaged** to **find and recommend events tailored to you** through an **AI-powered prompt system**. Students can:
✅ **Ask for event suggestions** based on their mood, interests, or needs (e.g., "I need a stress-relief event" → Yoga & therapy dogs).
✅ **Auto-sync events to Google Calendar** based on their availability, ensuring easy scheduling.
✅ **Refine recommendations** by adjusting preferences and generating new event suggestions.

To make recommendations even more **personalized**, we integrated a **Retrieval-Augmented Generation (RAG) model** using **Pinecone-hosted vector embeddings**, allowing students to input preferences and receive tailored event matches.

By prioritizing **wellness-focused activities** like meditation sessions, fitness classes, mental health workshops, and creative art events, we aim to improve **student mental health and work-life balance.**

## How We Built It

- **Selenium** for web scraping SBEngaged (since no official API exists).
- **Google Calendar API** for seamless one-click event integration.
- **RAG Model + Pinecone** for **personalized event matching** based on user preferences.
- **Frontend + UI/UX** to ensure a **smooth, aesthetic, and intuitive experience.**

## Challenges We Ran Into

- **Web scraping limitations**: SBEngaged doesn’t offer an API, so **scraping event data reliably was tough** and slow.
- **Google Calendar API hurdles**: Initial integration required deep documentation dives.
- **RAG:** Integrating OpenAIAPI along with pinecone and then **having the front end use that data was a little tough.**
- **Bringing the idea to life**: The hardest part wasn’t coding—it was realizing this **feeling we all had as club leaders** and turning it into something real.

## Accomplishments We're Proud Of

🏆 **Automating event collection despite no official API.**
🏆 **Successfully integrating AI recommendations with calendar sync.**
🏆 **Mastering RAG, Selenium, and Google API in a short time.**
🏆 **Developing a platform that improves student mental health and well-being.**

## What We Learned

Beyond the tech stack, we learned:
✨ **The power of balancing work, fun, and wellness.**
✨ **That great ideas start from solving everyday frustrations.**
✨ **Hackathons test your limits, but teamwork makes all the difference.**
✨ **Time management is everything—especially when deadlines are tight.**

## What's Next for SBU~GO-MO

📌 **Official SBEngaged Integration** – Partnering with the university to introduce an **SBEngaged API** for seamless event management and to encourage opensource.
📌 **Expanding beyond campus** – Supporting **off-campus** and **Stony Brook-sponsored events** like NYC trips, Six Flags outings, and adventure sports.
📌 **Enhanced wellness tracking** – Encouraging a **healthier student lifestyle** through personalized event curation and **mental health-friendly activities.**
📌 **Personalized RAG model integration** – Making event suggestions even **smarter, aesthetic, and wellness-driven** by syncing only the most relevant events to students’ calendars.

At Stony Brook, academics can be intense—but **student life shouldn’t be.**

SBU~GO-MO is more than an event app. It’s a **wellness tool**, a **stress reliever**, and a way to **help students thrive, not just survive.**

🚀 **Find your people. Find your balance. Find your GO-MO.**
