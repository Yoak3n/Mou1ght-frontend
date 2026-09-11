import { type FC } from 'react';
import { Button } from '../ui/button';
import { Eye } from 'lucide-react';

interface ViewButtonProps {
    count: number;
    type: 'article' | 'sharing' | 'message';
}

const ViewButton: FC<ViewButtonProps> = ({ count, type }) => {
    return (
        <Button  variant='ghost' className='hover:bg-accent hover:text-accent-foreground'>
            <Eye />
            <span className="ml-2">{count}</span>
        </Button>
    );
};

export default ViewButton;