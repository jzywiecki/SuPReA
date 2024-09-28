import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const InviteModal = ({ isOpen, onClose, children }) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Invite Members</DialogTitle>
                    <DialogDescription>
                        Search and invite new members to your project.
                    </DialogDescription>
                </DialogHeader>
                {children}
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default InviteModal;
