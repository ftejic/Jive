import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";

interface Props {
  isSettingsOpen: boolean;
  setIsSettingsOpen: any;
}

function Settings(props: Props) {
  return (
    <Sheet open={props.isSettingsOpen} onOpenChange={props.setIsSettingsOpen}>
      <SheetContent
        side="left"
        className="w-screen max-w-none sm:max-w-none md:w-4/12"
      >
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
        </SheetHeader>
        <div>
            
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default Settings;
