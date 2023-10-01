import BookCardSkeleton from "@/components/search/BookCardSkeleton";

export default function loading() {
  return (
    <>
      <div>Találatok lekérése...</div>
      <div className="flex min-h-screen min-w-full flex-col p-24 pt-8">
        <div className="flex flex-col gap-2">
          <BookCardSkeleton />;
          <BookCardSkeleton />;
          <BookCardSkeleton />;
        </div>
      </div>
    </>
  );
}
