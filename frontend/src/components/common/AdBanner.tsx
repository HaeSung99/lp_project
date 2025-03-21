'use client';

interface AdBannerProps {
  position: 'left' | 'right';
}

const AdBanner = ({ position }: AdBannerProps) => {
  return (
    <div
      className={`fixed z-50 hidden xl:block ${
        position === 'left' ? 'left-4' : 'right-4'
      } top-1/2 h-[600px] w-[160px] -translate-y-1/2`}
    >
      <div className='flex h-[600px] w-[160px] items-center justify-center rounded-lg border border-lostark-400/20 bg-black2/50 backdrop-blur-sm'>
        <span className='text-gray-400'>160 x 600</span>
      </div>
    </div>
  );
};

export default AdBanner;
