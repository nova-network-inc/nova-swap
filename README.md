# NovaSwap™
 NovaSwap™ is a powerful DeFi multichain protocol, that allows users to manage their assets on several different networks. It uses Moralis, and is expected that in the future it will be possible to use it with Solana and other non-EVM networks, but for the time being, you can only use it with EVMs.

 Our code is open source, under the MIT Licence, so feel free to fork and make your changes to it.

 <b># If you are forking, please use the 'Fork' option on Github, and if you're doing it on any other way, please don't forget to disclose the credits and have some link referring back to our original repository.</b>

 <b># Requirements</b>

- NodeJS <a href="https://nodejs.org/en/download/" target="_blank">(download)</a>
- Yarn <a href="https://yarnpkg.com/getting-started/install" target="_blank">(download)</a>
- Git CLI <a href="https://git-scm.com/downloads" target="_blank">(download)</a> *

* Github is only needed if you're using git commands to clone, push, pull, etc.

 <b># Installation</b>

 1. Assuming you already have a Moralis account and server running, before running the app, you will need to create a file in the main folder called '.env' to specify your server's URL and ID. You can use the file 'EXAMPLE.env' as a template, and just delete the 'EXAMPLE' word, leaving only the '.env' extension.

 2. In the '.env' file you will only need the two lines below, spcifying your Moralis Server ID and URL:

 REACT_APP_MORALIS_APPLICATION_ID = 'MORALIS SERVER ID'
 REACT_APP_MORALIS_SERVER_URL = 'MORALIS SERVER URL'

 3. After you have created and saved your '.env' file, just run the two commands below in your PowerShell, Command Prompt, Terminal, or whatever IDE you're using:

 'yarn install'
 'yarn start'

 4. Done! You should have your NovaSwap™ up and running in your localhost just like that.
