import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
            <div className="relative mb-8">
                <h1 className="text-9xl font-black text-slate-600">404</h1>
                <p className="text-2xl font-bold text-slate-900 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full">
                    Boggaan lama helin
                </p>
            </div>
            <p className="text-slate-500 text-lg max-w-md mx-auto mb-12">
                Waxaad moodaa in bogga aad raadinayso uusan jirin ama meel kale loo raray.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/" className="btn-primary flex items-center gap-2">
                    <Home className="w-5 h-5" />
                    Back to Home
                </Link>
                <button onClick={() => window.history.back()} className="btn-secondary flex items-center gap-2">
                    <ArrowLeft className="w-5 h-5" />
                    Go Back
                </button>
            </div>
        </div>
    );
};

export default NotFound;
