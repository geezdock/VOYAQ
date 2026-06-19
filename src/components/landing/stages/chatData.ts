export interface ChatMessage {
  sender: string;
  text: string;
  time: string;
  color: string;
}

export const chaosMessages: ChatMessage[] = [
  { sender: "Rahul", text: "Goa?", time: "10:23 AM", color: "bg-accent" },
  { sender: "Ananya", text: "Too expensive.", time: "10:25 AM", color: "bg-peach-dark" },
  { sender: "Vivek", text: "What about Gokarna?", time: "10:28 AM", color: "bg-clay" },
  { sender: "Siddharth", text: "I'm only free after the 15th.", time: "10:32 AM", color: "bg-accent-light" },
  { sender: "Rahul", text: "Who's actually coming?", time: "10:45 AM", color: "bg-accent" },
  { sender: "Mrunal", text: "Wait, what are the dates?", time: "10:52 AM", color: "bg-peach" },
  { sender: "Ananya", text: "Guys I'm lost.", time: "11:05 AM", color: "bg-peach-dark" },
];
