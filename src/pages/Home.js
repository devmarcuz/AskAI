import React, { useState } from "react";
import { FaGithub, FaTwitter } from "react-icons/fa";
import { RiSendPlaneFill } from "react-icons/ri";
import Typewriter from "typewriter-effect";
import axios from "axios";
import "../css/Home.css";

const Home = () => {
  const [isTypingWelcome, setIsTypingWelcome] = useState(true);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userMessages, setUserMessages] = useState([]);
  const [result, setResult] = useState("");
  const [loadingStates, setLoadingStates] = useState(
    new Array(messages.length).fill(false)
  );

  // const [searching, setSearching] = useState(false)

  const api = "https://askai-backend.onrender.com/api/question";

  const ai_text =
    "Demo AI is a digital diviner designed to provide helpful and informative responses to your questions and inquirires with the help of artificial intelligence";

  const onSubmit = (e) => {
    e.preventDefault();

    setLoading(true);

    setMessages([...messages, { role: "user", content: message }]);

    setMessage("");

    setUserMessages([...userMessages, message]);

    // set the loading state for the new message to true
    setLoadingStates((prevLoadingStates) => [...prevLoadingStates, true]);

    axios
      .post(api, { message })
      .then((res) => {
        setLoading(false);
        setLoadingStates((prevLoadingStates) => [
          ...prevLoadingStates.slice(0, -1),
          false,
        ]);
        setResult(res.data.answer.replace(/\n/g, "<br>"));
        setMessages([
          ...messages,
          {
            role: "assitant",
            content: res.data.answer.replace(/\n/g, "<br>"),
            typing: true,
          },
        ]);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="container">
      <nav>
        <p>AskAI</p>
        <ul>
          <li>
            <a href="https://github.com/devmarcuz/AskAI" target="_blank">
              <FaGithub />
            </a>
            <a href="https://twitter.com/marcuzdrip" target="_blank">
              <FaTwitter />
            </a>
          </li>
        </ul>
      </nav>
      <section>
        <div className="welcome-container">
          <p className="ai-name">Demo</p>
          {isTypingWelcome ? (
            <Typewriter
              className="a"
              onInit={(typewriter) => {
                typewriter
                  .typeString(ai_text)
                  .start()
                  .callFunction(() => {
                    setIsTypingWelcome(false);
                  });
              }}
              options={{
                delay: 10,
              }}
            />
          ) : (
            <p className="ai-response">{ai_text}</p>
          )}
        </div>
        <div className="message-container">
          {messages.map((msg, index) => (
            <div key={index} className="msg-container">
              <div className="label">
                <p className="user">Me</p>
                <p className="user-response">{userMessages[index]}</p>
              </div>
              <div className="label">
                <p className="ai-name">Demo</p>
                {loadingStates[index] && (
                  <div className="loading">
                    <Typewriter
                      onInit={(typewriter) => {
                        typewriter
                          .typeString("Thinking...")
                          .start()
                          .callFunction(() => {
                            setMessages((prevState) => {
                              const updatedMessages = [...prevState];
                              updatedMessages[index].typing = false;
                              return updatedMessages;
                            });
                          });
                      }}
                      options={{
                        delay: 10,
                      }}
                    />
                    {/* <p>.</p> */}
                  </div>
                )}
                {/* {msg.typing ? (
                  <Typewriter
                    className="a"
                    onInit={(typewriter) => {
                      typewriter
                        .typeString(ai_text)
                        .start()
                        .callFunction(() => {
                          msg.typing = false;
                        });
                    }}
                    options={{
                      delay: 10,
                    }}
                  />
                ) : (
                  <p className="ai-response">{ai_text}</p>
                )} */}
                {!loading && msg.typing === true ? (
                  <Typewriter
                    onInit={(typewriter) => {
                      typewriter
                        .typeString(result)
                        .start()
                        .callFunction(() => {
                          setMessages((prevState) => {
                            const updatedMessages = [...prevState];
                            updatedMessages[index].typing = false;
                            return updatedMessages;
                          });
                        });
                    }}
                    options={{
                      delay: 10,
                    }}
                  />
                ) : (
                  <p
                    dangerouslySetInnerHTML={{
                      __html: msg.role === "assitant" ? msg.content : "",
                    }}
                    className="ai-response"
                  ></p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
      <form onSubmit={onSubmit}>
        <textarea
          name=""
          id=""
          placeholder="Ask Demo anything..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        ></textarea>
        <button type="submit">
          Send <RiSendPlaneFill />
        </button>
      </form>

      <footer>
        <p>Knowledge base up to September 2021</p>
        <p>Reference: OpenAI.com</p>
      </footer>
    </div>
  );
};

export default Home;
