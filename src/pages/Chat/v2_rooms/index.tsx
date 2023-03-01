import Modal from "../../../components/Modal";
import { useCallback, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import io from "socket.io-client";
import CreateRoomModal from "../../../components/CreateRoomModal";

const chat_backurl = "http://127.0.0.1:3095";

// const socket = io(`${chat_backurl}/v2_room`, {
//   transports: ["websocket"],
// });

function V2rooms({ socket }: { socket: any }) {
  const navigate = useNavigate();
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [showCreateRoomModal, setShowCreateRoomModal] = useState(false);

  const {
    data: rooms,
    isLoading,
    refetch,
  } = useQuery<any>(["roomlist"], () =>
    fetch(chat_backurl + `/api/room_list/`).then((res) => res.json())
  );
  // console.log(rooms);

  const queryClient = useQueryClient();

  const onNewRoom = useCallback(
    async (data: any) => {
      // console.log("데이터: ", data);
      queryClient.setQueryData(["roomlist"], () => {
        return { data: [...rooms.data, data] };
      });
    },
    [queryClient, rooms]
  );

  const onRemoveRoom = useCallback((data: any) => refetch(), [refetch]);

  useEffect(() => {
    if (onNewRoom && onRemoveRoom) {
      console.log("v2_rooms에 진입하셨습니다.");
      socket?.on("newRoom", onNewRoom);
      socket?.on("removeRoom", onRemoveRoom);
    }
    return () => {
      console.log("v2_rooms에서 나가셨습니다.");
      socket?.off("newRoom", onNewRoom);
      socket?.off("removeRoom", onRemoveRoom);
    };
  }, [onNewRoom, onRemoveRoom]);

  const onEnterEvent = useCallback((e: any) => {
    let enterApiURL: any, password: any;
    if (e.target.dataset.password === "true") {
      password = prompt("비밀번호를 입력하세요");
      e.preventDefault();
      enterApiURL = `/api/room_list/room/${e.target.dataset.id}?password=${password}`;
    } else {
      enterApiURL = `/api/room_list/room/${e.target.dataset.id}`;
    }
    fetch(chat_backurl + enterApiURL)
      .then((res) => res.text())
      .then((data) => {
        if (data === "OK") {
          let navigateURL = `${e.target.dataset.id}/chat`;
          if (e.target.dataset.password === "true") {
            navigateURL = `${e.target.dataset.id}/chat?password=${password}`;
          }
          navigate(navigateURL);
        } else {
          setPasswordError("비밀번호가 틀렸습니다.");
        }
      });
  }, []);

  const onCloseModal = useCallback(() => {
    setShowCreateRoomModal(
      (prevShowCreateRoomModal) => !prevShowCreateRoomModal
    );
  }, []);

  if (isLoading) return <div>isLoading...</div>;
  return (
    <>
      <h1>채팅방</h1>
      <fieldset onClick={() => setPasswordError("")}>
        <legend>채팅방 목록</legend>
        <table>
          <thead>
            <tr>
              <th>방 제목</th>
              <th>종류</th>
              <th>방장</th>
            </tr>
          </thead>
          <tbody>
            {rooms.data.map((room: any) => {
              return (
                <tr data-id={room.id} key={room.id}>
                  <td>{room.title}</td>
                  <td>{room.password ? "비밀방" : "공개방"}</td>
                  <td>{room.owner}</td>
                  <td>
                    <button
                      data-password={room.password ? "true" : "false"}
                      data-id={room.id}
                      onClick={onEnterEvent}
                    >
                      입장
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="error-message"></div>
        {/* <Link to="create_room">방 만들기</Link> */}
        <button style={{ display: "block" }} onClick={onCloseModal}>
          방 만들기
        </button>
        <CreateRoomModal
          show={showCreateRoomModal}
          onCloseModal={onCloseModal}
        />
      </fieldset>
      {passwordError && <div style={{ color: "red" }}>{passwordError}</div>}\
      <Link to="/">홈으로</Link>
    </>
  );
}

export default V2rooms;
