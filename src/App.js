import { useState } from "react";
const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [showAddFrind, setShowAddFriend] = useState(false);
  const [freinds, setFriends] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleShowAddFriend() {
    setShowAddFriend((show) => !show);
  }

  function handleAddFriends(newFriend) {
    setFriends((friends) => [...friends, newFriend]);
    setShowAddFriend(false);
  }
  function handleSelect(friend) {
    console.log(friend.id);
    // setSelectedFriend(friend);
    setSelectedFriend((selected) =>
      selected?.id === friend.id ? null : friend
    );
    setShowAddFriend(false);
  }

  function handleSplitBill(value) {
    // console.log(value);
    setFriends((freinds) =>
      freinds.map((friend) =>
        friend.id === selectedFriend.id
          ? {
              ...friend,
              balance: friend.balance + value,
            }
          : friend
      )
    );
    setSelectedFriend(null);
  }
  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          freinds={freinds}
          handleSelect={handleSelect}
          selectedFriend={selectedFriend}
        />
        {showAddFrind && <FormAddFriend onAddFriends={handleAddFriends} />}
        <Button onClick={handleShowAddFriend}>
          {showAddFrind ? "Close" : "Add Friend"}
        </Button>
      </div>
      {selectedFriend && (
        <SpiltForm
          selectedFriend={selectedFriend}
          onSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}
function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function FriendList({ freinds, handleSelect, selectedFriend }) {
  return (
    <ul>
      <div>
        {freinds.map((friend) => (
          <Friend
            friend={friend}
            key={friend.id}
            handleSelect={handleSelect}
            selectedFriend={selectedFriend}
          />
        ))}
      </div>
    </ul>
  );
}
function Friend({ friend, handleSelect, selectedFriend }) {
  const isSelected = selectedFriend?.id === friend.id;
  console.log(isSelected);
  return (
    <div>
      <div>
        <li className={isSelected ? "selected" : ""}>
          <img src={friend.image} alt="altimg" />
          <h3>{friend.name} </h3>
          {friend.balance < 0 && (
            <p className="red">
              You owe {friend.name} $ {Math.abs(friend.balance)}
            </p>
          )}
          {friend.balance > 0 && (
            <p className="green">
              {friend.name} owns you ${Math.abs(friend.balance)}
            </p>
          )}
          {friend.balance === 0 && (
            <p className="red">You and {friend.name} are even</p>
          )}
          <Button onClick={() => handleSelect(friend)}>
            {isSelected ? "Close" : "Select"}
          </Button>
        </li>
      </div>
    </div>
  );
}
function FormAddFriend({ onAddFriends }) {
  const [name, setFriendName] = useState("");
  const [image, setImageUrl] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();
    if (!name || !image) return;
    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };
    console.log(newFriend);
    onAddFriends(newFriend);
    setFriendName("");
    setImageUrl("https://i.pravatar.cc/48");
  }
  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>Friend Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setFriendName(e.target.value)}
      />
      <label>Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImageUrl(e.target.value)}
      />
      <Button>Add friends</Button>
    </form>
  );
}
function SpiltForm({ selectedFriend, balance, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [yourBIll, setyourBill] = useState("");
  const [whoIsPaying, setWhoIsPaying] = useState("user");
  const freindExp = bill ? bill - yourBIll : "";

  function handleFormSubmit(e) {
    e.preventDefault();
    if (!bill || !yourBIll) return;
    onSplitBill(whoIsPaying === "user" ? freindExp : -yourBIll);
  }
  // if (whoIsPaying === "user") {
  //   balance = bill - yourBIll;
  // } else if (whoIsPaying === "freind") {
  //   balance = yourBIll;
  // }
  return (
    <div>
      <div>
        <form className="form-split-bill" onSubmit={handleFormSubmit}>
          <h2>split a bill with {selectedFriend.name}</h2>

          <label htmlFor="bill">bill Value</label>
          <input
            id="bill"
            type="text"
            value={bill}
            onChange={(e) => setBill(Number(e.target.value))}
          ></input>

          <label htmlFor="yourexp">your expense</label>
          <input
            id="yourexp"
            type="text"
            value={yourBIll}
            onChange={(e) =>
              setyourBill(
                Number(e.target.value) > bill
                  ? yourBIll
                  : Number(e.target.value)
              )
            }
          ></input>

          <label htmlFor="friexp">{selectedFriend.name} expense</label>
          <input id="friexp" type="text" value={freindExp} disabled />

          <label>whos paying the bill</label>
          <select
            value={whoIsPaying}
            onChange={(e) => setWhoIsPaying(e.target.value)}
          >
            <option value="user">You</option>
            <option value="freind">{selectedFriend.name}</option>
          </select>

          <Button>Split Bill</Button>
        </form>
      </div>
    </div>
  );
}
