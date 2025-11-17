import { useNavigate } from 'react-router';
import { useChessAPI } from '@/request/chess';
import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAppStore } from '@/store/appStore';
interface Room {
  roomId: string;
  name?: string;
  players?: Player[];
  maxPlayers: number;
  status: 'waiting' | 'playing' | 'finished';
  timeLimit?: number;
  createdBy?: string;
  isPrivate?: boolean;
}

interface Player {
  userId: string;
  username: string;
  avatar?: string;
  side?: 'RED' | 'BLACK';
  ready: boolean;
  isOnline: boolean;
}

const ChessHall = () => {
  const { getRooms, joinLobby, joinRoom, createRoom } = useChessAPI();
  const setCurrentPlayer = useAppStore((state) => state.setCurrentPlayer);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        await joinLobby();
        const data = await getRooms();
        console.log('Fetching rooms...', data);
        setRooms(data?.data?.rooms || []);
      } catch (error) {
        console.error('获取房间列表失败:', error);
        setRooms([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, [getRooms, joinLobby]);
  const handleJoinRoom = async (roomId: string) => {
    const data = await joinRoom({ roomId });
    console.log('@', data.data.playerId);
    setCurrentPlayer(data.data.playerId);
    navigate('/chess/room/' + roomId);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-800 p-8">
      {/* 头部区域 */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white drop-shadow-lg">🏛️ 象棋大厅</h1>
          <p className="mt-2 text-purple-200">选择一个房间开始对战</p>
        </div>
        <button
          onClick={createRoom}
          className="rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:shadow-xl">
          + 创建房间
        </button>
      </div>

      {/* 加载状态 */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
            <p className="text-xl text-white">加载中...</p>
          </div>
        </div>
      ) : rooms.length > 0 ? (
        /* 房间网格 */
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {rooms.map((room) => (
            <div
              key={room.roomId}
              className="group hover:shadow-3xl relative overflow-hidden rounded-2xl bg-white/10 p-6 shadow-2xl backdrop-blur-lg transition-all duration-300 hover:bg-white/20">
              {/* 装饰性背景 */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>

              {/* 房间内容 */}
              <div className="relative z-10">
                {/* 房间标题和状态 */}
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">{room.name || `房间 ${room.roomId}`}</h3>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      room.status === 'waiting'
                        ? 'border border-emerald-400/30 bg-emerald-500/20 text-emerald-200'
                        : room.status === 'playing'
                          ? 'border border-orange-400/30 bg-orange-500/20 text-orange-200'
                          : 'border border-gray-400/30 bg-gray-500/20 text-gray-200'
                    }`}>
                    {room.status === 'waiting' ? '等待中' : room.status === 'playing' ? '对局中' : '已结束'}
                  </span>
                </div>

                {/* 房间信息 */}
                <div className="mb-4 flex items-center gap-4 text-sm text-purple-200">
                  {room.timeLimit && (
                    <div className="flex items-center gap-1">
                      <span>⏱️</span>
                      <span>{Math.floor(room.timeLimit / 60)}分钟</span>
                    </div>
                  )}
                </div>

                {/* 玩家区域 */}
                <div className="mb-6">
                  <div className="mb-3 text-sm font-medium text-purple-200">玩家列表</div>
                  <div className="flex items-center justify-center gap-3">
                    {/* 玩家1 */}
                    <div className="flex flex-col items-center gap-2">
                      <div className="relative">
                        <Avatar className="h-12 w-12 ring-2 ring-white/20">
                          {room.players?.[0] && <AvatarImage src="https://github.com/shadcn.png" />}
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                            {room.players?.[0]?.username?.[0] || '?'}
                          </AvatarFallback>
                        </Avatar>
                        {room.players?.[0]?.isOnline && (
                          <div className="absolute -right-1 -bottom-1 h-4 w-4 rounded-full bg-green-400 ring-2 ring-white"></div>
                        )}
                      </div>
                      <span className="text-xs text-white/80">{room.players?.[0]?.username || '等待加入'}</span>
                      {room.players?.[0]?.side && (
                        <span
                          className={`rounded-full px-2 py-1 text-xs ${
                            room.players[0].side === 'RED'
                              ? 'bg-red-500/20 text-red-200'
                              : 'bg-gray-600/20 text-gray-200'
                          }`}>
                          {room.players[0].side === 'RED' ? '红方' : '黑方'}
                        </span>
                      )}
                    </div>

                    {/* VS 图标 */}
                    <div className="flex flex-col items-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg">
                        <span className="text-2xl">⚔️</span>
                      </div>
                      <span className="mt-1 text-xs text-yellow-200">VS</span>
                    </div>

                    {/* 玩家2 */}
                    <div className="flex flex-col items-center gap-2">
                      <div className="relative">
                        <Avatar className="h-12 w-12 ring-2 ring-white/20">
                          {room.players?.[1] && <AvatarImage src="https://github.com/shadcn.png" />}
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                            {room.players?.[1]?.username?.[0] || '?'}
                          </AvatarFallback>
                        </Avatar>
                        {room.players?.[1]?.isOnline && (
                          <div className="absolute -right-1 -bottom-1 h-4 w-4 rounded-full bg-green-400 ring-2 ring-white"></div>
                        )}
                      </div>
                      <span className="text-xs text-white/80">{room.players?.[1]?.username || '等待加入'}</span>
                      {room.players?.[1]?.side && (
                        <span
                          className={`rounded-full px-2 py-1 text-xs ${
                            room.players[1].side === 'RED'
                              ? 'bg-red-500/20 text-red-200'
                              : 'bg-gray-600/20 text-gray-200'
                          }`}>
                          {room.players[1].side === 'RED' ? '红方' : '黑方'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* 加入按钮 */}
                <button
                  onClick={() => handleJoinRoom(room.roomId)}
                  disabled={room.status !== 'waiting' || (room.players?.length || 0) >= room.maxPlayers}
                  className="w-full rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 py-3 font-semibold text-white shadow-lg transition-all hover:shadow-xl disabled:cursor-not-allowed disabled:bg-gray-500/50 disabled:hover:scale-100">
                  {room.status === 'waiting' ? '加入房间' : room.status === 'playing' ? '观战' : '房间已结束'}
                </button>
              </div>

              {/* 悬浮效果装饰 */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
            </div>
          ))}
        </div>
      ) : (
        /* 空状态 */
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-6 text-8xl">🏆</div>
          <h3 className="mb-2 text-2xl font-bold text-white">暂无房间</h3>
          <p className="text-purple-200">快来创建第一个房间开始对战吧！</p>
        </div>
      )}
    </div>
  );
};

export default ChessHall;
