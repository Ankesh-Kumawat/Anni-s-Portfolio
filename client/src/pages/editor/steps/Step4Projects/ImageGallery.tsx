import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Upload, Star, Check, X, GripVertical, Image as ImageIcon } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { EditorData } from "../../types";

interface ImageGalleryProps {
    project: any;
    index: number;
    data: EditorData;
    handlers: any;
}

export function ImageGallery({ project, index, data, handlers }: ImageGalleryProps) {
    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    Project Images
                </Label>
                <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">{project.images.length} total</span>
                    {project.images.length > 0 && (
                        <Badge className="bg-primary/10 text-primary border-primary text-xs">
                            <Star className="w-3 h-3 mr-1 fill-primary" />
                            Top {Math.min(6, project.images.length)} in JSON
                        </Badge>
                    )}
                </div>
            </div>

            <label className="cursor-pointer block">
                <div className="border-2 border-dashed border rounded-xl p-6 bg-card hover:border-primary hover:bg-primary/10 transition-all text-center">
                    <Upload className="w-8 h-8 text-muted-foreground/60 mx-auto mb-2" />
                    <p className="text-sm font-medium text-foreground">Click to upload images</p>
                    <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 10MB each • Drag to reorder • First image is cover</p>
                </div>
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handlers.handleImageUpload(index, e)}
                    className="hidden"
                />
            </label>

            {project.images.length > 0 && (
                <div className="space-y-3">
                    <div className="bg-primary/10 border-2 border-primary/30 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                            <Star className="w-5 h-5 text-primary fill-primary flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-bold text-primary">
                                    Drag to Reorder • Top 6 Images Saved to JSON
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    First image = Cover Image • Drag images to arrange priority • Only top 6 will be in final portfolio
                                </p>
                            </div>
                        </div>
                    </div>

                    <DragDropContext onDragEnd={(result) => handlers.handleDragEnd(index, result)}>
                        <Droppable droppableId={`project-images-${index}`}>
                            {(provided, droppableSnapshot) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className="grid grid-cols-3 gap-4 max-h-[500px] overflow-y-auto scrollbar-hide p-2"
                                >
                                    {project.images.map((imagePath: string, imgIndex: number) => {
                                        const asset = data.assets.images.find(a =>
                                            imagePath.includes(a.path)
                                        );
                                        const displaySrc = asset?.preview || imagePath;
                                        const isInTop6 = imgIndex < 6;
                                        const isCover = imgIndex === 0;

                                        return (
                                            <Draggable
                                                key={`${index}-${imgIndex}`}
                                                draggableId={`${index}-${imgIndex}`}
                                                index={imgIndex}
                                            >
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        style={{
                                                            ...provided.draggableProps.style,
                                                            transform: snapshot.isDragging
                                                                ? `${provided.draggableProps.style?.transform} scale(1.05)`
                                                                : provided.draggableProps.style?.transform,
                                                        }}
                                                        className={`draggable-image relative group rounded-xl overflow-hidden border-4 cursor-grab active:cursor-grabbing ${snapshot.isDragging
                                                            ? "border-primary shadow-2xl opacity-95 z-50 ring-4 ring-primary/30"
                                                            : droppableSnapshot.isDraggingOver
                                                                ? isInTop6
                                                                    ? "border-primary shadow-lg"
                                                                    : "border-muted shadow-md"
                                                                : isInTop6
                                                                    ? "border-primary shadow-md hover:shadow-lg hover:scale-[1.02]"
                                                                    : "border-muted shadow-sm hover:shadow-md hover:scale-[1.02]"
                                                            }`}
                                                    >
                                                        {/* Drag Indicator */}
                                                        <div className="absolute top-2 left-2 w-8 h-8 bg-black/70 rounded-lg flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                                            <GripVertical className="w-5 h-5 text-white" />
                                                        </div>

                                                        {/* Image */}
                                                        <img
                                                            src={displaySrc}
                                                            alt={`Project ${imgIndex + 1}`}
                                                            className="w-full h-32 object-cover select-none pointer-events-none"
                                                            draggable={false}
                                                        />

                                                        {/* Delete Button */}
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handlers.removeImage(index, imgIndex);
                                                            }}
                                                            className="absolute top-2 right-2 w-8 h-8 bg-destructive text-destructive-foreground rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 z-20"
                                                        >
                                                            <X className="w-5 h-5" />
                                                        </button>

                                                        {/* Cover Badge */}
                                                        {isCover && (
                                                            <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg pointer-events-none">
                                                                <Star className="w-3 h-3 fill-current" />
                                                                COVER
                                                            </div>
                                                        )}

                                                        {/* Position Badge */}
                                                        <div className={`absolute bottom-2 left-2 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 pointer-events-none ${isInTop6
                                                            ? "bg-primary text-primary-foreground"
                                                            : "bg-black/70 text-white"
                                                            }`}>
                                                            #{imgIndex + 1}
                                                            {isInTop6 && <Check className="w-3 h-3" />}
                                                        </div>

                                                        {/* In JSON Badge */}
                                                        {isInTop6 && (
                                                            <div className="absolute bottom-2 right-2 bg-primary/90 text-primary-foreground px-2 py-1 rounded text-xs font-bold pointer-events-none">
                                                                IN JSON
                                                            </div>
                                                        )}

                                                        {/* Not in JSON Overlay */}
                                                        {!isInTop6 && (
                                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                                                <p className="text-white text-xs font-bold text-center px-2">
                                                                    Not in JSON<br />
                                                                    <span className="text-[10px]">Drag to top 6</span>
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </Draggable>
                                        );
                                    })}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </div>
            )}
        </div>
    );
}
