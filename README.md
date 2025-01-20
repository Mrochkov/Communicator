<h1>Communicator App</h1>

A modern communicator app built with Django (backend) and React (frontend), offering an intuitive and feature-rich platform similar to Discord. The application integrates AI-powered features to enhance the user experience, making communication smarter and more engaging.

<h2>Features</h2>

<h3>Real-Time Messaging:</h3> 
<p>Seamless, real-time chat functionality.</p>
<p>Messages language translation.</p>

<h3>AI Integration:</h3>
<p>Chatbot to help new and lonely users.</p>
<p>Intelligent message suggestions and auto-completion.</p>
<p>Chat summarization to quickly review past conversations.</p>

<h3>Channel and Group Support:</h3>
<p>Create and manage channels for group discussions or private interactions.</p>
<p>Role-based access control for managing user permissions within channels.</p>

<h3>User Management:</h3>
<p>Secure user authentication and profile management.</p>
<p>You can add your own photo/gif as a profile picture.</p>

<h3>Customizable Themes:</h3> 
<p>Personalize the app’s appearance with light and dark modes.</p>

<h2>Tech Stack</h2>
<p><strong>Frontend:</strong> React, MaterialUI.</p>
<p><strong>Backend:</strong> Django with Django REST Framework.</p>
<p><strong>Database:</strong> mySQL.</p>
<p><strong>Real-Time Communication:</strong> WebSocket implementation using Django Channels.</p>
<p><strong>AI/ML:</strong> Integration of AI APIs/models for chat-related features.</p>

<hr>

<h2><strong>How to run</strong></h2>

<p>Install all requirements for the project</p>

<p>pip install --no-deps --no-cache-dir -r requirements.txt</p>

<p>backend - cd /communicator -> uvicorn communicator.asgi:application --port 8000 --log-level debug</p>
<p>frontend - cd /FrontendCommunicator -> npm run dev</p>
<p>rasa - rasa run</p>

<hr>
<p>For this to work must have docker engine installed on your machine</p>
<p><strike>Rasa model is not started with docker</strike></p>
Docker-compose up --build
