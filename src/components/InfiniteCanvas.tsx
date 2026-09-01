import { ReactInfiniteCanvas } from "react-infinite-canvas";

const InfiniteCanvas = () => {
  return (
    <div className="infinite-canvas-root h-screen w-screen">
      <ReactInfiniteCanvas
        backgroundConfig={{
          className: "bg-[#F7F7F5]",
          disable: true,
        }}
        panOnScroll
        onCanvasMount={(mountFunc) => {
          mountFunc.fitContentToView({ scale: 1, duration: 0});
        }}
      >
        <div className="grid grid-cols-4 gap-60 p-20">
          <div className="h-40 w-60 bg-gray-300" />
          <div className="h-40 w-60 bg-gray-300" />
          <div className="h-40 w-60 bg-gray-300" />
          <div className="h-40 w-60 bg-gray-300" />

          <div className="h-40 w-60 bg-gray-300" />
          <div className="h-40 w-60 bg-gray-300" />
          <div className="h-40 w-60 bg-gray-300" />
          <div className="h-40 w-60 bg-gray-300" />

          <div className="h-40 w-60 bg-gray-300" />
          <div className="h-40 w-60 bg-gray-300" />
          <div className="h-40 w-60 bg-gray-300" />
          <div className="h-40 w-60 bg-gray-300" />
        </div>
      </ReactInfiniteCanvas>
    </div>
  );
};

export default InfiniteCanvas;
