import AicyroChatbot from "@/components/Chatbot/AicyroChatbot";

export default function RootLayout({ children }) {
  return (
    <div>
      <main>
        {children}
        <AicyroChatbot />
      </main>
    </div>
  );
}
