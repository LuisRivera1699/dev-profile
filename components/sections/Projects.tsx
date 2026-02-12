"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { ProjectSerialized } from "@/types/firestore";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ProjectsProps {
  projects: ProjectSerialized[];
}

export function Projects({ projects }: ProjectsProps) {
  const [detailProjectId, setDetailProjectId] = useState<string | null>(null);
  const detailProject = detailProjectId
    ? (projects.find((p) => p.id === detailProjectId) ?? null)
    : null;

  return (
    <section id="projects" className="border-b border-border/80 bg-muted/30 py-20 md:py-28">
      <div className="container mx-auto max-w-5xl px-6">
        <h2 className="font-mono text-3xl font-semibold tracking-tight md:text-4xl text-foreground">
          {`// projects`}
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="overflow-hidden border-border/80 bg-card transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
            >
              {project.imageUrl ? (
                <div className="relative aspect-video w-full bg-muted">
                  <Image
                    src={project.imageUrl}
                    alt={project.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                </div>
              ) : null}
              <CardHeader>
                <h3 className="font-mono text-lg font-medium text-foreground">
                  {project.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {project.description}
                </p>
                {project.impact ? (
                  <p className="text-sm text-muted-foreground">
                    <span className="font-mono text-primary">impact:</span>{" "}
                    {project.impact}
                  </p>
                ) : null}
              </CardHeader>
              <CardContent className="space-y-4">
                {project.techStack?.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded border border-border bg-muted/80 px-2 py-0.5 font-mono text-xs text-muted-foreground"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="font-mono text-xs"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setDetailProjectId(project.id);
                    }}
                  >
                    View detail
                  </Button>
                  {project.githubUrl && (
                    <Button variant="outline" size="sm" asChild className="font-mono text-xs border-primary/50 text-primary hover:bg-primary/10">
                      <Link
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        GitHub
                      </Link>
                    </Button>
                  )}
                  {project.liveUrl && (
                    <Button size="sm" asChild className="font-mono text-xs">
                      <Link
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Live
                      </Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={!!detailProject} onOpenChange={(open) => !open && setDetailProjectId(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto border-border/80 flex flex-col">
          {detailProject && (
            <>
              <DialogHeader className="shrink-0">
                <DialogTitle className="font-mono text-xl">
                  {detailProject.title}
                </DialogTitle>
                <DialogDescription className="sr-only">
                  Full project details and description
                </DialogDescription>
              </DialogHeader>
              {detailProject.imageUrl ? (
                <div className="relative w-full h-40 shrink-0 rounded-md overflow-hidden bg-muted">
                  <Image
                    src={detailProject.imageUrl}
                    alt={detailProject.title}
                    fill
                    className="object-cover object-top"
                    sizes="512px"
                  />
                </div>
              ) : null}
              <div className="space-y-4 min-h-0">
                <div>
                  <h4 className="font-mono text-xs font-medium text-primary mb-1">description</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                    {detailProject.description}
                  </p>
                </div>
                {detailProject.impact ? (
                  <div>
                    <h4 className="font-mono text-xs font-medium text-primary mb-1">impact</h4>
                    <p className="text-sm text-muted-foreground">{detailProject.impact}</p>
                  </div>
                ) : null}
                {detailProject.techStack?.length > 0 ? (
                  <div>
                    <h4 className="font-mono text-xs font-medium text-primary mb-2">tech</h4>
                    <div className="flex flex-wrap gap-2">
                      {detailProject.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="rounded border border-border bg-muted/80 px-2 py-1 font-mono text-xs text-muted-foreground"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}
                <div className="flex gap-2 pt-2">
                  {detailProject.githubUrl && (
                    <Button variant="outline" size="sm" asChild className="font-mono text-xs border-primary/50 text-primary hover:bg-primary/10">
                      <Link
                        href={detailProject.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        GitHub
                      </Link>
                    </Button>
                  )}
                  {detailProject.liveUrl && (
                    <Button size="sm" asChild className="font-mono text-xs">
                      <Link
                        href={detailProject.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Live
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
