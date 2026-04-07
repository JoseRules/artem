'use client';

import Link from 'next/link';
import { DoctorsImage } from '@/assets/DoctorsImage';
import { useTheme } from '@/contexts/ThemeContext';
import { RightArrowIcon } from '@/assets/icons';
import { useUser } from '@/contexts/UserContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useFirstNotification } from '@/lib/api/notify';
import { wakeUp } from '@/lib/api/wakeUp';

export default function Home() {
  const router = useRouter();
  const { theme } = useTheme();
  const { user } = useUser();

  useFirstNotification();

  useEffect(() => {
    void wakeUp();
  }, []);

  return (
    <div className="
      flex items-center justify-center
      h-[calc(100vh-82px)] sm:h-[calc(100vh)] md:h-[calc(100vh+100px)] lg:h-[calc(100vh-82px)]
      px-4 sm:px-6 lg:px-8
      pt-8 sm:pt-12 
    ">
      <div className="
        flex flex-col lg:flex-row items-center justify-between
        w-full max-w-6xl
        gap-6 lg:gap-12
      ">
        {/* Left Side - Search Section */}
        <div className="
          flex flex-col items-start justify-center
          w-full md:w-2/3
          space-y-4 md:space-y-8
        ">
        <div className="space-y-2 md:space-y-6">
          <h1 className="
            text-xl sm:text-4xl lg:text-5xl
            font-bold
            text-foreground
            leading-tight
            text-center md:text-left
          ">
            Find your physician and{' '}
            <span className="text-primary text-xl md:text-3xl lg:text-4xl">schedule an appointment</span>
          </h1>
          
          <p className="
            text-base sm:text-lg
            text-foreground/80
            leading-relaxed
            text-center md:text-left
          ">
            Connect with qualified healthcare professionals and book your next medical consultation with ease.
          </p>
        </div>

        <div className="w-full flex justify-center">
          <button
            type="button"
            onClick={() => {
              if (user?._id) {
                router.push('/account');
              } else {
                router.push('/signUp');
              }
            }}
            className="
              inline-flex items-center justify-center gap-2
              min-w-[14rem] px-10 py-3
              bg-primary
              text-white
              rounded-lg
              font-semibold
              hover:bg-primary/90 hover:cursor-pointer
              focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
              transition-colors duration-200
            "
          >
            Get Started
            <RightArrowIcon size={20} className="shrink-0 text-white" />
          </button>
        </div>
        </div>

        {/* Right Side - Doctors Image */}
        <div className="
          flex items-center justify-center
            w-full lg:w-1/2
        ">
          <div className="
            relative
            w-[250px] sm:w-full max-w-sm sm:max-w-md lg:max-w-lg
            aspect-square
          ">
            <DoctorsImage color={theme === 'dark' ? '#4a8fa8' : '#0379c7'} /> 
          </div>
        </div>
      </div>
    </div>
  );
}
