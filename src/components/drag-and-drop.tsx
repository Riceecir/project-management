import React, { ReactNode } from "react";
import {
  Droppable,
  DroppableProps,
  Draggable,
  DraggableProps,
  DroppableProvided,
  DroppableProvidedProps,
} from "react-beautiful-dnd";

/* 可放置组件 */
type DropProps = Omit<DroppableProps, "children"> & { children: ReactNode };
export const Drop = ({ children, ...props }: DropProps) => {
  return (
    <Droppable {...props}>
      {(provided) => {
        if (React.isValidElement(children)) {
          return React.cloneElement(children, {
            ...provided.droppableProps,
            ref: provided.innerRef,
            provided,
          });
        }

        return <div />;
      }}
    </Droppable>
  );
};

/* 可放置组件子组件 */
type DropChildProps = Partial<
  { provided: DroppableProvided } & DroppableProvidedProps
> &
  React.HTMLAttributes<HTMLDivElement>;
export const DropChild = React.forwardRef<HTMLDivElement, DropChildProps>(
  ({ children, ...props }, ref) => {
    return (
      <div ref={ref} {...props}>
        {children}
        {props.provided?.placeholder}
      </div>
    );
  }
);

/* 可拖拽组件 */
type DragProps = Omit<DraggableProps, "children"> & { children: ReactNode };
export const Drag = ({ children, ...props }: DragProps) => {
  return (
    <Draggable {...props}>
      {(provided) => {
        if (React.isValidElement(children)) {
          return React.cloneElement(children, {
            ...provided.dragHandleProps,
            ...provided.draggableProps,
            ref: provided.innerRef,
          });
        }

        return <div />;
      }}
    </Draggable>
  );
};
