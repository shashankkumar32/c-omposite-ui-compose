
'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import RecentOrders from './inc/list';
import LastFiveBills from './inc/recentorderlist';

interface SalesData {
  today: { totalSales: number; totalEarnings: number };
  thisWeek: { totalSales: number; totalEarnings: number };
  thisMonth: { totalSales: number; totalEarnings: number };
}

const Home: React.FC = () => {
  const [data, setData] = useState<SalesData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';

  const fetchSummary = async () => {
    try {
      const response = await axios.get(
        'https://pos-backend-jwt-auth.onrender.com/api/bill/bills/summary',
        { headers: { Authorization: `${token}` } }
      );
      setData(response.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const rollingNumberAnimation = (value: number) => ({
    from: 0,
    to: value,
    duration: 2,
    ease: 'easeOut',
  });

  const SkeletonCard = () => (
    <div className="flex-1 p-6 rounded-lg shadow-lg border-2 border-transparent bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse dark:bg-gradient-to-r dark:from-gray-700 dark:to-gray-800">
      <div className="h-6 w-1/3 bg-gray-300 mb-4 rounded dark:bg-gray-600"></div>
      <div className="h-12 w-1/2 bg-gray-300 mb-2 rounded dark:bg-gray-600"></div>
      <div className="h-12 w-1/2 bg-gray-300 rounded dark:bg-gray-600"></div>
    </div>
  );

  const Card = ({ title, sales, earnings }: { title: string; sales: number; earnings: number }) => (
    <motion.div
      className="flex-1 p-6 rounded-xl shadow-lg border-4 border-gradient bg-white dark:bg-gray-800 dark:border-transparent"
      style={{
        borderImage: 'linear-gradient(90deg, #BD8AFF, #7540A9, #C8C7FF) 1',
      }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold mb-2 text-black dark:text-white">{title}</h2>
      <p className="text-lg text-black dark:text-gray-300">Sales:</p>
      <motion.span className="text-4xl font-bold text-black dark:text-white" animate={rollingNumberAnimation(sales)}>
        {sales}
      </motion.span>
      <p className="text-lg text-black dark:text-gray-300">Earnings:</p>
      <motion.span className="text-4xl font-bold text-black dark:text-white" animate={rollingNumberAnimation(earnings)}>
        {earnings}
      </motion.span>
    </motion.div>
  );

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-6 p-4 justify-between items-stretch">
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            <Card
              title="Today's Summary"
              sales={data?.today.totalSales || 0}
              earnings={data?.today.totalEarnings || 0}
            />
            <Card
              title="Weekly Summary"
              sales={data?.thisWeek.totalSales || 0}
              earnings={data?.thisWeek.totalEarnings || 0}
            />
            <Card
              title="Monthly Summary"
              sales={data?.thisMonth.totalSales || 0}
              earnings={data?.thisMonth.totalEarnings || 0}
            />
          </>
        )}
      </div>

      {/* Recent Orders and Last Five Bills */}
      <div className="mt-8 border-t border-gray-300 dark:border-gray-600">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <LastFiveBills />
          </div>
          <div className="flex-1">
            <RecentOrders />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
