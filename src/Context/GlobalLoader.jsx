
import { useLoading } from '../Context/Loader';
import { ThreeCircles } from 'react-loader-spinner';

const GlobalLoader = () => {
  const { loading } = useLoading();

  if (!loading) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50">
      <ThreeCircles
        height="80"
        width="80"
        color="#E7C555"
        visible={true}
        ariaLabel="three-circles-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  );
};

export default GlobalLoader;