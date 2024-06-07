const createUserForm = document.querySelector("#create-user");
const dialog = document.querySelector("dialog");
const openDialogBtn = document.querySelector("#open-dialog");
const closeDialogBtn = document.querySelector("#close-dialog");
const friendSelectElem = document.querySelector("select");
const refreshBtn = document.querySelector("#refresh-btn");
const sendMessageForm = document.querySelector("#send-message-form");
const you = document.querySelector(".you");
const newChatBtn = document.querySelector("#new-chat-btn");
const requestRefreshBtn = document.querySelector("#request-refresh-btn");
// const joinChatBtn = document.querySelector("#join-chat-btn");
const requestsElem = document.querySelector(".chat-requests .requests");
const refreshChatBtn = document.querySelector("#refresh-chats-btn");
const chatsElem = document.querySelector(".chats");

const URL = "http://localhost:8000";
let strangerFriend;
let adminUsername;
let adminUserId;
let chatRoomId;
let isChatRoomJoined = false;

// close and open dialog
openDialogBtn.onclick = () => {
  dialog.showModal();
};
closeDialogBtn.onclick = () => {
  dialog.close();
};

// show chats
const showChats = (chats) => {
  chatsElem.innerHTML = "";
  chats.forEach(({ sender, chat }) => {
    const p = document.createElement("p");
    const span = document.createElement("span");
    p.append(span);
    if (adminUserId === sender) {
      // const sender = document.createElement('p')
      p.className = "your-message";
      span.textContent = chat;
    } else {
      // const receiver = document.createElement('p')
      p.className = "friend-message";
      span.textContent = chat;
    }
    chatsElem.append(p);
  });
};

// join chat
const joinChat = async ({ _id }) => {
  const res = await fetch(`${URL}/join-chat-room/${_id}`, {
    method: "PUT",
    header: {
      "content-type": "application/json",
    },
  });
  const data = await res.json();
  console.log(data);
  if (!data.status && !data.chatRoom) {
    alert(data.message);
    return;
  }
  strangerFriend = data.chatRoom.roomCreater;
  friendSelectElem.value = strangerFriend;
  chatRoomId = data.chatRoom._id;
  isChatRoomJoined = true;
  showChats(data.chatRoom.chats);
  console.log(`current chat room id: ${data.chatRoom._id}`);
};

// push message(chat)
sendMessageForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!isChatRoomJoined) {
    alert("Please join any chat room to talk!");
    return;
  }
  const chatInput = e.currentTarget[0];
  const chat = chatInput.value;
  if (!chat) {
    alert("Please enter any message first!");
    return;
  }
  const res = await fetch(`${URL}/push-chat`, {
    method: "PUT",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ senderId: adminUserId, chat, roomId: chatRoomId }),
  });
  const data = await res.json();
  showChats(data.chatRoom.chats);
  console.log(chatInput);
  chatInput.value = "";
  chatInput.focus();
});

// refresh chats
refreshChatBtn.addEventListener("click", async () => {
  const res = await fetch(`${URL}/get-updated-chats/${chatRoomId}`);
  const data = await res.json();
  console.log(data);
  const chats = data.updatedChatRoom.chats;
  showChats(chats);
});

// join chat btn
// joinChatBtn?.addEventListener("click", async () => {
//   const res = await fetch(`${URL}/join-chat-room`, {
//     method: "PUT",
//     header: {
//       "content-type": "application/json",
//     },
//     body: JSON.stringify({ friend: adminUserId, roomId: chatRoomId }),
//   });
//   const data = await res.json();
//   strangerFriend = data.chatRoom.roomCreater;
//   friendSelectElem.value = strangerFriend;
//   console.log(`current chat room id: ${data.chatRoom._id}`);
// });

// refresh chat request
requestRefreshBtn.addEventListener("click", async () => {
  requestsElem.innerHTML = "";
  const res = await fetch(`${URL}/chat-room/${adminUsername}`);
  const data = await res.json();
  console.log(data);
  if (!data.chatRooms.length) {
    request.innerHTML = `<span>there is not available any chat room`;
    return;
  }
  data.chatRooms.forEach((room) => {
    requestsElem.innerHTML += `
      <div class="request-info">
        <p>'${room.roomCreater}' has been sent a chat request</p>
        <button type="button" id="cancel-chat-btn">cancel</button>
        <button type="button" id="join-chat-btn">join</button>
      </div>
    `;

    const joinChatBtn = document.querySelector("#join-chat-btn");
    joinChatBtn.addEventListener("click", async () => {
      await joinChat(room);
    });
  });
  // const oneChatRoom = data.chatRooms[0];
  // request.innerHTML = `<span>${oneChatRoom.roomCreater}</span><span>${oneChatRoom._id}</span>`;
  // chatRoomId = oneChatRoom._id;
});

// create chat room
newChatBtn.addEventListener("click", async () => {
  const selectedFriend = friendSelectElem.value;
  if (!selectedFriend || selectedFriend === "select stranger") {
    alert("Please select a friend first!");
    return;
  }
  const res = await fetch(`${URL}/create-chat-room`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ friend: selectedFriend }),
    credentials: "include",
  });
  const data = await res.json();
  const chatRoom = data.chatRoom;
  console.log(chatRoom);
  chatRoomId = chatRoom._id;
  isChatRoomJoined = true;
});

const listAllFriends = (allFriends) => {
  friendSelectElem.innerHTML = `<option value="select stranger" selected disabled>select stranger</option>`;
  allFriends.forEach((friend) => {
    if (friend.username === adminUsername) return;
    const option = document.createElement("option");
    option.value = friend.username;
    option.textContent = friend.name + `(${friend.username})`;
    friendSelectElem.append(option);
  });
};

refreshBtn.addEventListener("click", async () => {
  const res = await fetch(`${URL}/all-active-user`);
  const data = await res.json();
  const friends = data.users;
  listAllFriends(friends);
  if (!friends.find((friend) => friend.username === strangerFriend)) {
    alert("your friend didn't found");
    return;
  }
  friendSelectElem.value = strangerFriend;
});

const initializeUser = async ({ name, username }) => {
  try {
    you.textContent = `${name} (${username})`;
    const res = await fetch(`${URL}/all-active-user`, {
      method: "GET",
      credentials: "include",
    });
    const data = await res.json();
    const allActiveUser = data.users;
    console.log(allActiveUser);
    const totalActiveUser = allActiveUser.length;
    const randomFriend =
      allActiveUser[Math.floor(Math.random() * (totalActiveUser + 1))];
    if (!randomFriend) {
      // return "nobody live"
      console.log("nobody live right now");
    }
    listAllFriends(allActiveUser);
  } catch (error) {
    throw new Error(error.message);
  }
};

createUserForm.onsubmit = async (e) => {
  e.preventDefault();
  const name = e.currentTarget[0].value;
  const username = e.currentTarget[1].value;
  try {
    const res = await fetch(`${URL}/create-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, username }),
      credentials: "include",
    });
    const data = await res.json();
    adminUsername = data.user.username;
    adminUserId = data.user._id;
    dialog.close();
    console.log("loading...");
    await initializeUser(data.user);
    console.log("done");
  } catch (error) {
    console.log(error.message);
  }
};
