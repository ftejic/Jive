import { Cross2Icon } from "@radix-ui/react-icons";

interface Props {
  clickedImage: string;
  setClickedImage: any;
  setImagePreviewVisible: any;
}

function ImagePreview(props: Props) {
  return (
    <div className="w-screen h-screen absolute top-0 left-0 bg-background/95">
      <div className="flex justify-end">
        <Cross2Icon
          onClick={() => {
            props.setClickedImage("");
            props.setImagePreviewVisible(false);
          }}
          className="w-5 h-5 text-foreground m-4 cursor-pointer"
        />
      </div>
      <div className="flex justify-center items-center">
        <img
          src={props.clickedImage}
          alt="image"
          className="max-h-[calc(100vh-52px)] w-auto"
        />
      </div>
    </div>
  );
}

export default ImagePreview;
