# AskFolio

## MVP
The main/home page contains:
- Header with logo, main navigation
- Side bar with list of chats if exist
- Main area: 
  - Message list, display a welcome message
  - Search box, blank and user start a new chat.


The user sends a message, then the bot answers.
It continues in a number of chats.

The user may start a new chat session. Then the old chat is stored and a new chat starts. The same pattern continues.

The chat history is listed in the Side bar on desktop version. On Mobile it is not decided.
User click on one of the link and it opens the chat.
User may click on "new chat" and new blank chat box and chat area opens.

- chat = {
  userChat: {
    chatId: id,
    message: string
  },
  botChat: {
    chatId: id,
    message: string
  }
}

chats: chat[];

### Mermaid Diagram

```mermaid
flowchart TD
    A["User sends a message"] --> B["Create userChat object"]
    B --> C["userChat = { chatId: id, message: string }"]
    C --> D["Bot generates a reply"]
    D --> E["Create botChat object"]
    E --> F["botChat = { chatId: id, message: string }"]
    F --> G["Store in chats: chat[]"]
    G --> H{"New chat session?"}
    H -- Yes --> I["Start a new chat session"]
    I --> A
    H -- No --> J["Continue existing chat"]
    J --> A
```

### Sequence Diagram

```mermaid
sequenceDiagram
    actor User
    participant App as App / Chat UI
    participant Input as InputBox
    participant MessageList as MessageList
    participant UserMsg as UserMessage
    participant BotMsg as BotMessage
    participant Store as chats[] / Session State

    User->>App: Open chat app
    App->>MessageList: Render conversation list
    MessageList->>UserMsg: Show previous user messages
    MessageList->>BotMsg: Show previous bot replies
    App->>Input: Show textarea + send button

    User->>Input: Type message
    User->>Input: Click send
    Input->>App: Submit message
    App->>Store: Create userChat object
    Note over Store: userChat = { chatId, message }
    App->>UserMsg: Render new user message
    App->>Store: Create botChat object
    Note over Store: botChat = { chatId, message }
    App->>BotMsg: Render bot response

    App->>Store: Append chat to chats[]
    Note over Store: chats: chat[]

    alt New chat session
        User->>App: Start new chat
        App->>Store: Initialize fresh chat session
        App->>Input: Ready for next message
    else Continue current chat
        User->>Input: Send another message
        Input->>App: New message submitted
        App->>Store: Append to same chat history
    end
```

