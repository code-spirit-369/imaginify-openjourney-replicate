"use client";

import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Loader2Icon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export const ImageGenerator = () => {
  const [prompt, setPrompt] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [images, setImages] = useState<any[]>([]);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    const res = await axios.get("/api/generate");
    setImages(res.data.images);
  };

  const handleGenerateImage = async () => {
    setLoading(true);

    try {
      const response = await axios.post("/api/generate", { prompt });

      if (response.status === 200) {
        fetchImages();
      } else {
        console.log("Something went wrong");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setPrompt("");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full h-full">
      <div className="max-w-3xl w-full px-4 py-8 md:px-6 md:py-12">
        <div className="flex flex-col items-center gap-4">
          <div className="flex w-full items-center space-x-2">
            <Input
              type="text"
              placeholder="Enter a prompt to generate an image"
              className="flex-1"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <Button disabled={loading} onClick={handleGenerateImage}>
              {loading ? (
                <>
                  Generating{" "}
                  <Loader2Icon className="animate-spin size-4 ml-2" />
                </>
              ) : (
                "Generate"
              )}
            </Button>
          </div>

          {images.length > 0 ? (
            <div className="mt-8 md:mt-24 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
              {images.map((image) => (
                <Dialog key={image._id}>
                  <DialogTrigger asChild>
                    <Card className="overflow-hidden cursor-pointer shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out">
                      <CardContent className="p-0">
                        <Image
                          src={image.imageUrl}
                          alt={image.prompt}
                          width={300}
                          height={300}
                          className="object-cover w-full aspect-square"
                        />
                      </CardContent>
                    </Card>
                  </DialogTrigger>

                  <DialogContent className="pt-12">
                    <Image
                      src={image.imageUrl}
                      alt={image.prompt}
                      width={600}
                      height={600}
                      className="object-cover w-full aspect-square"
                    />

                    <p className="mt-4 text-lg text-muted-foreground">
                      <strong>Prompt: </strong>
                      {image.prompt}
                    </p>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          ) : (
            <div className="mt-8 md:mt-24 flex items-center justify-center">
              <p className="text-lg text-center text-muted-foreground">
                No images found
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
