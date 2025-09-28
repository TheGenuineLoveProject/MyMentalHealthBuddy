import { useState } from "react";
import { AlertTriangle, Phone, MessageCircle, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";

export default function CrisisButton() {
  const [open, setOpen] = useState(false);
  
  const crisisResources = [
    {
      name: "988 Suicide & Crisis Lifeline",
      number: "988",
      description: "Free, confidential 24/7 support",
      icon: Phone,
      action: "tel:988"
    },
    {
      name: "Crisis Text Line",
      number: "Text HOME to 741741",
      description: "Free 24/7 text support",
      icon: MessageCircle,
      action: "sms:741741?body=HOME"
    },
    {
      name: "Emergency Services",
      number: "911",
      description: "Immediate emergency help",
      icon: AlertTriangle,
      action: "tel:911"
    }
  ];
  
  return (
    <>
      {/* Floating Crisis Button */}
      <Button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 rounded-full w-16 h-16 bg-red-600 hover:bg-red-700 shadow-lg z-50"
        data-testid="crisis-button"
      >
        <Heart className="h-8 w-8 text-white animate-pulse" />
      </Button>
      
      {/* Crisis Support Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              Crisis Support
            </DialogTitle>
            <DialogDescription className="text-base">
              You're not alone. Help is available 24/7.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            {crisisResources.map((resource) => {
              const Icon = resource.icon;
              return (
                <Card key={resource.name} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <a
                      href={resource.action}
                      className="flex items-start gap-4 no-underline"
                      data-testid={`crisis-${resource.name.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <div className="p-3 bg-red-100 rounded-lg">
                        <Icon className="h-6 w-6 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900">
                          {resource.name}
                        </h3>
                        <p className="text-red-600 font-bold text-xl my-1">
                          {resource.number}
                        </p>
                        <p className="text-gray-600">
                          {resource.description}
                        </p>
                      </div>
                    </a>
                  </CardContent>
                </Card>
              );
            })}
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">
                Remember:
              </h4>
              <ul className="space-y-1 text-sm text-blue-800">
                <li>• It's okay to ask for help</li>
                <li>• You deserve support and care</li>
                <li>• Things can and will get better</li>
                <li>• Your life has value and meaning</li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}