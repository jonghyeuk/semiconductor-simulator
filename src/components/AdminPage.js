import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../utils/firebase';

const ADMIN_PASSWORD_KEY = 'simulator_admin_pw';

const AdminPage = ({ onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const adminPassword = process.env.REACT_APP_ADMIN_PASSWORD || 'admin1234';

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === adminPassword) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('비밀번호가 올바르지 않습니다.');
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchVisitors = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'visitors'), orderBy('visitedAt', 'desc'));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          visitedAt: doc.data().visitedAt?.toDate?.(),
        }));
        setVisitors(data);
      } catch (err) {
        console.error('Failed to fetch visitors:', err);
        setError('데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchVisitors();
  }, [isAuthenticated]);

  const formatDate = (date) => {
    if (!date) return '-';
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const formatDuration = (seconds) => {
    if (!seconds && seconds !== 0) return '-';
    if (seconds < 60) return `${seconds}초`;
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    if (min < 60) return `${min}분 ${sec}초`;
    const hr = Math.floor(min / 60);
    return `${hr}시간 ${min % 60}분`;
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full mx-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800">관리자 로그인</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
          </div>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              autoFocus
            />
            {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
            <button
              type="submit"
              className="w-full mt-4 py-3 bg-gray-800 text-white rounded-lg font-medium text-sm hover:bg-gray-900 transition-colors"
            >
              로그인
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[85vh] flex flex-col">
        {/* 헤더 */}
        <div className="flex justify-between items-center p-5 border-b border-gray-200">
          <div>
            <h3 className="text-lg font-bold text-gray-800">방문자 관리</h3>
            <p className="text-sm text-gray-500 mt-0.5">총 {visitors.length}명</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
        </div>

        {/* 테이블 */}
        <div className="flex-1 overflow-auto p-5">
          {loading ? (
            <div className="text-center text-gray-500 py-10">로딩 중...</div>
          ) : visitors.length === 0 ? (
            <div className="text-center text-gray-500 py-10">아직 방문자가 없습니다.</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-200">
                  <th className="pb-3 font-medium">#</th>
                  <th className="pb-3 font-medium">이메일</th>
                  <th className="pb-3 font-medium">방문 일시</th>
                  <th className="pb-3 font-medium">체류 시간</th>
                  <th className="pb-3 font-medium">소식 수신</th>
                </tr>
              </thead>
              <tbody>
                {visitors.map((v, i) => (
                  <tr key={v.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 text-gray-400">{i + 1}</td>
                    <td className="py-3 text-gray-800">{v.email}</td>
                    <td className="py-3 text-gray-600">{formatDate(v.visitedAt)}</td>
                    <td className="py-3 text-gray-600">{formatDuration(v.durationSeconds)}</td>
                    <td className="py-3">
                      {v.marketingConsent ? (
                        <span className="text-green-600 text-xs bg-green-50 px-2 py-0.5 rounded-full">동의</span>
                      ) : (
                        <span className="text-gray-400 text-xs">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
