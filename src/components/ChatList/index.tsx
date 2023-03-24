import {
  ChatBubble,
  // ChatBubbleTail,
  ChatItem,
  ChatLists,
  ChatMain,
  ChatProfile,
} from './styles';
import chatSendButtonUrl from '../../assets/smallButton/chatSendButton.svg';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import React from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from 'react-query';

export const ChatElement = styled.section`
  position: relative;
`;

const chat_backurl = 'http://127.0.0.1:3095';

async function postChat(
  roomId: string,
  data: any,
  username: string
): Promise<string> {
  const token = localStorage.getItem('jwt_token');
  let res = await fetch(`${chat_backurl}/room/${roomId}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      createdAt: new Date(),
      chat: data,
      user: username,
    }),
  }).then((res) => res.json());
  return res;
}

const ChatsMenu = ({
  username,
  roomDatas,
  myUser,
  roomId,
}: {
  username: string;
  roomDatas: any;
  myUser: any;
  roomId: string;
}) => {
  const token = localStorage.getItem('jwt_token');

  const kickMutation = useMutation(async () => {
    const response = await fetch(
      `${chat_backurl}/room/${roomId}/kick/${username}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      }
    );
    return response.json();
  });

  const onKickOther = async (e: any) => {
    e.stopPropagation();
    kickMutation.mutate();
  };
  const onBanOther = async () => {
    let res = await fetch(`${chat_backurl}/room/${roomId}/ban/${username}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({}),
    }).then((res) => {
      res.json();
    });
  };

  const onAdminOther = async () => {
    let res = await fetch(`${chat_backurl}/room/${roomId}/admin/${username}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({}),
    }).then((res) => {
      res.json();
    });
  };

  const onMuteOther = async () => {
    let res = await fetch(`${chat_backurl}/room/${roomId}/mute/${username}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({}),
    }).then((res) => {
      res.json();
    });
  };

  return (
    <div
      style={{
        position: 'absolute',
        backgroundColor: 'gray',
        borderRadius: '10px',
        padding: '10px',
        fontSize: '16px',
        zIndex: 1,
        top: '2rem',
      }}
    >
      {myUser.username === roomDatas.owner ? (
        myUser.username === username ? (
          <div>나는 방장입니다</div>
        ) : (
          <>
            <div onClick={onAdminOther}>관리자 임명하기</div>
            <div onClick={onKickOther}>5분간 kick</div>
            <div onClick={onBanOther}>영원히 ban</div>
            <div onClick={onMuteOther}>5분간 mute</div>
          </>
        )
      ) : roomDatas.adminList.includes(myUser.username) ? (
        myUser.username === username ? (
          <div>나는 관리자입니다</div>
        ) : username === roomDatas.owner ? (
          <div>방장님 입니다</div>
        ) : (
          <>
            <div onClick={onKickOther}>5분간 kick</div>
            <div onClick={onBanOther}>영원히 ban</div>
            <div>5분간 mute</div>
          </>
        )
      ) : myUser.username === username ? (
        <div>나는 일반 유저입니다</div>
      ) : (
        <>
          <div>친구로써 차단하기</div>
        </>
      )}
    </div>
  );
};

const EachChat = React.memo(
  ({
    index,
    chatData,
    roomDatas,
    myUser,
    roomId,
  }: // selectedChatIndex,
  // handleProfileImageClick,
  any) => {
    const [selectedChatProfile, setSelectedChatProfile] =
      useState<boolean>(false);

    const handleChatProfileClick = useCallback((e: any) => {
      e.stopPropagation();
      setSelectedChatProfile((prev) => !prev);
    }, []);

    return (
      <ChatItem other={chatData.user !== myUser.username} key={index}>
        <ChatProfile>
          <img
            src={chatData.imgSrc}
            alt="User profile"
            onClick={handleChatProfileClick}
          />
        </ChatProfile>
        {selectedChatProfile && (
          <ChatsMenu
            username={chatData.user}
            roomDatas={roomDatas}
            myUser={myUser}
            roomId={roomId}
          />
        )}
        <ChatMain>
          <span>{chatData.user}</span>
          <span>{chatData.createdAt}</span>
          <ChatBubble
            other={chatData.user !== myUser.username}
            style={{ whiteSpace: 'pre-wrap' }}
          >
            {chatData.chat}
          </ChatBubble>
        </ChatMain>
      </ChatItem>
    );
  }
);

const ChatListComponent = ({
  chatDatas,
  roomDatas,
  myUser,
  roomId,
}: {
  chatDatas: any;
  roomDatas: any;
  myUser: any;
  roomId: string;
}) => {
  // const [selectedChatIndex, setSelectedChatIndex] = useState(-1);
  // const handleProfileImageClick = useCallback(
  //   (index: number) => {
  //     console.log(index);
  //     if (selectedChatIndex === index) {
  //       setSelectedChatIndex(-1);
  //       return;
  //     }
  //     setSelectedChatIndex(index);
  //   },
  //   [selectedChatIndex]
  // );

  return (
    <ChatLists>
      {chatDatas.map((chatData: any, index: number) => (
        <EachChat
          key={index}
          index={index}
          chatData={chatData}
          roomDatas={roomDatas}
          myUser={myUser}
          roomId={roomId}
          // selectedChatIndex={selectedChatIndex}
          // handleProfileImageClick={handleProfileImageClick}
        />
      ))}
    </ChatLists>
  );
};

const ChatList = ({ Flex, socket }: { Flex: number; socket: any }) => {
  const params = useParams<{ roomId?: string }>();
  const { roomId } = params;
  const [chat, setChat] = useState('');
  const scrollbarRef = useRef<Scrollbars>(null);

  console.log(`현재 roomId: ${roomId} 에 있는 상태입니다.`);
  const token = localStorage.getItem('jwt_token');
  const options = {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  };

  const {
    data: chatDatas,
    isLoading: isLoadingChats,
    isError: isErrorChats,
    error,
    refetch: refetchChatList,
  } = useQuery<any>(
    ['chat', roomId],
    async () => {
      try {
        const response = await fetch(
          `${chat_backurl}/room/${roomId}/chat`,
          options
        );
        const res = await response.json();
        console.log('[[[myQueryDatas]]] ' + res);
        if (!response.ok) {
          throw new Error(res);
        }
        return res;
      } catch (error) {
        console.error('ERROR!!!!', error);
        throw error;
      }
    }
    // {
    //   retryOnMount: true,
    // }
  );

  const { data: userData, isLoading: isLoadingUser } = useQuery<any>(
    ['user'],
    () => fetch(chat_backurl + '/user', options).then((res) => res.json())
  );

  const { data: roomDatas, isLoading: isLoadingRoom } = useQuery<any>(
    ['room', roomId],
    () =>
      fetch(chat_backurl + `/room/${roomId}`, options).then((res) => res.json())
    // {
    //   retryOnMount: true,
    // }
  );
  console.log(roomId, '채팅방 데이터: ', roomDatas);
  console.log(
    roomId,
    '채팅 데이터: ',
    chatDatas,
    '에러는 ',
    error,
    isErrorChats
  );

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutate: mutateChat } = useMutation<unknown, unknown, any, unknown>(
    ({ chat, userData }) => postChat(roomId!, chat, userData.username),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['chat', roomId]);
      },
    }
  );

  const onMessage = useCallback(
    async (data: any) => {
      // console.log("데이터: ", data);
      queryClient.setQueryData(['chat', roomId], (chatData: any) => {
        return [...chatData, data];
      });
      // console.log(data, userData.username);
      if (data.user === userData.username) {
        setTimeout(() => {
          scrollbarRef.current?.scrollToBottom();
        }, 10);
        return;
      }
      if (
        scrollbarRef.current &&
        scrollbarRef.current.getScrollHeight() <
          scrollbarRef.current.getClientHeight() +
            scrollbarRef.current.getScrollTop() +
            150
      ) {
        setTimeout(() => {
          scrollbarRef.current?.scrollToBottom();
        }, 50);
      } else {
        toast.success('새 메시지가 도착했습니다.', {
          onClick() {
            scrollbarRef.current?.scrollToBottom();
          },
          closeOnClick: true,
        });
        toast.clearWaitingQueue();
      }
    },
    [queryClient, roomId]
  );
  const onJoin = useCallback(function (data: any) {
    console.log('JoinData: ', data);
  }, []);
  const onExit = useCallback(function (data: any) {
    console.log('LeaveData: ', data);
  }, []);
  const onKick = function (data: any) {
    if (data === userData.username) {
      console.log('KickData: ', data, userData.username);
      console.log('강퇴당하셨습니다');
      navigate('/chat/v3_rooms');
      queryClient.invalidateQueries(['chat', roomId]);
      queryClient.invalidateQueries(['room', roomId]);
      console.log('kick되기전 invalidate했음');
    } else {
      console.log(`${data}님이 강퇴당햇습니다`);
    }
  };
  const onRole = useCallback(function (data: any) {
    refetchChatList();
  }, []);

  useEffect(() => {
    if (roomDatas && userData) {
      console.log('ChatList useEffect 실행됨 (roomDatas, userData 존재)');
      const is_kicked = roomDatas.kickList.find(
        (kickData: any) => kickData.username === userData.username
      );
      if (is_kicked) {
        console.log('기존 kicked된 사람이니 invalidate하겠다');
        queryClient.invalidateQueries(['room', roomId]);
      }
    }
    return () => {
      console.log('ChatList useEffect 종료됨');
    };
  }, [roomDatas, userData]);

  useEffect(() => {
    if (userData) {
      console.log('소켓 기능이 on 되었습니다! (join, exit, message)');
      socket?.on('message', onMessage);
      socket?.on('join', onJoin);
      socket?.on('exit', onExit);
      // socket?.emit('join', roomId);
      socket?.on('kick', onKick);
      socket?.on('role', onRole);
    }
    return () => {
      console.log('소켓 기능이 off 되었습니다! (join, exit, message)');
      socket?.off('message', onMessage);
      socket?.off('join', onJoin);
      socket?.off('exit', onExit);
      socket?.off('kick', onKick);
      socket?.off('role', onRole);
      // socket?.emit('leave', roomId);
    };
  }, [userData]);

  const onChangeChat = useCallback((e: any) => {
    e.preventDefault();
    setChat(e.target.value);
  }, []);

  const onSubumitChat = (e: any) => {
    e.preventDefault();
    if (!chat?.trim()) return;
    mutateChat({ chat, userData });
    setChat('');
  };

  function handleKeyDown(event: any) {
    if (event.keyCode === 13 && !event.shiftKey) {
      // Submit the form
      event.preventDefault();
      if (!chat?.trim()) return;
      mutateChat({ chat, userData });
      setChat('');
    } else if (event.keyCode === 13 && event.shiftKey) {
      // Add a new line
      event.preventDefault();
      setChat((prevChat) => prevChat + '\n');
    }
  }

  if (isLoadingChats || isLoadingRoom || isLoadingUser) return <div />;
  if (isErrorChats) {
    const response = error as Response;
    queryClient.invalidateQueries(['chat', roomId]);
    queryClient.invalidateQueries(['room', roomId]);
    console.log('에러메시지: ', Object.keys(response));

    return (
      <div style={{ flex: 1.85 }}>
        <div>방에 대한 권한이 없습니다</div>
        <div>{response && response.statusText}</div>
        <Link to="/chat/v3_rooms">방 목록으로</Link>
      </div>
    );
  }

  return (
    <div
      style={{
        borderRadius: '2rem',
        border: '0.3rem solid black',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        flex: Flex,
      }}
    >
      <div style={{ flex: 9 }}>
        <Scrollbars autoHide ref={scrollbarRef}>
          {/* <ChatLists>
            {chatList.map((chatData) => (
              <ChatItem other={chatData.name !== 'me'}>
                <ChatProfile>
                  <img src={chatData.imgSrc} alt="User profile" />
                </ChatProfile>
                <ChatMain>
                  <span>{chatData.name}</span>
                  <ChatBubble
                    other={chatData.name !== 'me'}
                    style={{ whiteSpace: 'pre-wrap' }}
                  >
                    {chatData.content}
                  </ChatBubble>
                </ChatMain>
              </ChatItem>
            ))}
          </ChatLists> */}
          <ChatListComponent
            chatDatas={chatDatas}
            roomDatas={roomDatas}
            myUser={userData}
            roomId={roomId}
          />
          <ToastContainer limit={1} />
        </Scrollbars>
      </div>
      <form
        style={{
          flex: 1,
          width: '100%',
          display: 'flex',
          marginBottom: '1rem',
        }}
        onSubmit={onSubumitChat}
      >
        <textarea
          style={{
            flex: 8,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '2rem',
            border: '0.3rem solid black',
            padding: '1rem',
            overflow: 'hidden',
            resize: 'none',
          }}
          onChange={onChangeChat}
          onKeyDown={handleKeyDown}
          value={chat}
        ></textarea>
        <div
          style={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <button
            style={{
              padding: '0.5rem',
              borderRadius: '1rem',
              backgroundColor: '#FCF451',
              border: '0.3rem solid black',
              width: '4rem',
              height: '4rem',
            }}
            onClick={onSubumitChat}
          >
            <img
              src={chatSendButtonUrl}
              style={{ maxWidth: '100%', maxHeight: '100%' }}
            />
          </button>
        </div>
      </form>
      <div
        style={{ flex: 0.3, display: 'flex', justifyContent: 'space-evenly' }}
      >
        <Link to="/chat/v3_rooms" style={{ border: '0.2rem solid red' }}>
          <button>방 목록으로</button>
        </Link>
        <Link to="/chat/v3_rooms" style={{ border: '0.2rem solid red' }}>
          <button
            onClick={() => {
              socket?.emit('leave', roomId);
            }}
          >
            방 나가기
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ChatList;
