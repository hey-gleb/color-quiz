import { useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog.tsx';
import { Button } from '@/components/ui/button.tsx';

import rawChangelog from '@/changelog.json';

const ChangelogModal = () => {
  const [currentVersionChanges, _] = useState<{
    version: string;
    changes: string[];
  }>(rawChangelog[0]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={'secondary'} color={'primary'}>
          What's New
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            What's New — v{currentVersionChanges.version}
          </DialogTitle>
          <DialogDescription>
            Here's a small summary of cool things we've added to make the game .
            even better.
          </DialogDescription>
        </DialogHeader>
        <ul className="list-disc pl-6 space-y-2">
          {currentVersionChanges.changes.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
};

export default ChangelogModal;
