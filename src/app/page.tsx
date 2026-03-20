import Image from 'next/image';
import { MagnifyingGlassIcon } from '@/assets/icons';
import doctors from '@/assets/doctors.jpg';

export default function Home() {
  return (
    <div className="
      flex items-center justify-center
      h-[calc(100vh-82px)]
      px-4 sm:px-6 lg:px-8
      py-12
    ">
      <div className="
        flex flex-col lg:flex-row items-center justify-between
        w-full max-w-6xl
        gap-8 lg:gap-12
      ">
        {/* Left Side - Search Section */}
        <div className="
          flex flex-col items-start justify-center
          w-full lg:w-1/2
          space-y-8
        ">
        <div className="space-y-6">
          <h1 className="
            text-3xl sm:text-4xl lg:text-5xl
            font-bold
            text-foreground
            leading-tight
          ">
            Find your physician and{' '}
            <span className="text-primary">schedule an appointment</span>
          </h1>
          
          <p className="
            text-lg
            text-foreground/80
            leading-relaxed
          ">
            Connect with qualified healthcare professionals and book your next medical consultation with ease.
          </p>
        </div>

        {/* Search Section */}
        <div className="
          w-full
          space-y-4
        ">
          {/* Specialty Dropdown */}
          <div className="w-full">
            <label htmlFor="specialty" className="block text-sm font-medium text-foreground mb-2">
              Select Specialty
            </label>
            <select 
              id="specialty"
              className="
                w-full
                px-4 py-3
                border border-border
                rounded-lg
                bg-background
                text-foreground
                focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                transition-colors duration-200
              "
            >
              <option value="">Choose a specialty...</option>
              <option value="cardiology">Cardiology</option>
              <option value="dermatology">Dermatology</option>
              <option value="endocrinology">Endocrinology</option>
              <option value="gastroenterology">Gastroenterology</option>
              <option value="gynecology">Gynecology</option>
              <option value="neurology">Neurology</option>
              <option value="oncology">Oncology</option>
              <option value="orthopedics">Orthopedics</option>
              <option value="pediatrics">Pediatrics</option>
              <option value="psychiatry">Psychiatry</option>
              <option value="radiology">Radiology</option>
              <option value="urology">Urology</option>
            </select>
          </div>

          {/* Search Button */}
          <button className="
            w-full
            flex items-center justify-center gap-3
            px-6 py-3
            bg-primary
            text-primary-foreground
            rounded-lg
            font-semibold
            hover:bg-primary/90
            focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
            transition-colors duration-200
          ">
            <MagnifyingGlassIcon 
              color="currentColor" 
              size={20} 
              className=""
            />
            Search
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
            w-full max-w-md lg:max-w-lg
            aspect-square
          ">
            <Image
              src={doctors}
              alt="Healthcare professionals"
              fill
              className="
                object-contain
                rounded-2xl
              "
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
