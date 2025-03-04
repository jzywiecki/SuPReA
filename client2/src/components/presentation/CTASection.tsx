import { Link } from 'react-router-dom';
import { useUserContext } from '@/contexts/custom-context-hooks';

interface CTASectionProps {
  title: string;
  description: string;
}

const CTASection = ({ title, description }: CTASectionProps) => {
  const { isLogged } = useUserContext();

  return (
    <div className="bg-indigo-600 py-10">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          {title}
        </h2>
        <p className="mt-4 text-lg text-indigo-100">
          {description}
        </p>
        <div className="mt-8">
          <Link
            to={isLogged ? "/projects" : "/login"}
            className="inline-block px-6 py-3 text-lg font-semibold text-indigo-600 bg-white rounded-md shadow-md hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Explore projects
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CTASection;
