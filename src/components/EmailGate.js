import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../utils/firebase';

const EmailGate = ({ onComplete }) => {
  const [email, setEmail] = useState('');
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('이메일을 입력해주세요.');
      return;
    }

    if (!isValidEmail(email)) {
      setError('올바른 이메일 형식을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      await addDoc(collection(db, 'visitors'), {
        email: email.trim(),
        marketingConsent,
        visitedAt: serverTimestamp(),
        userAgent: navigator.userAgent,
      });

      localStorage.setItem('simulator_email', email.trim());
      onComplete();
    } catch (err) {
      console.error('Error saving email:', err);
      // Firestore 에러 시에도 로컬 저장 후 진행 허용
      localStorage.setItem('simulator_email', email.trim());
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4">
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">⚛️</div>
          <h2 className="text-xl font-bold text-gray-800">
            반도체 공정 시뮬레이터
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            시작하려면 이메일을 입력해주세요
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일 주소"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            autoFocus
          />

          {error && (
            <p className="text-red-500 text-xs mt-2">{error}</p>
          )}

          <label className="flex items-start mt-4 cursor-pointer">
            <input
              type="checkbox"
              checked={marketingConsent}
              onChange={(e) => setMarketingConsent(e.target.checked)}
              className="mt-0.5 mr-2 rounded"
            />
            <span className="text-xs text-gray-500">
              교육 관련 소식을 보내드릴 수 있습니다.
            </span>
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-5 py-3 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? '처리 중...' : '시작하기'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmailGate;
