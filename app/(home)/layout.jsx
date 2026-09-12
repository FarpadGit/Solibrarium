export default function HomeLayout({ bestsellers, bookreviews }) {
  return (
    <div className="w-[calc(100vw-2*var(--page-margin))] min-[1792px]:w-[92rem]">
      {bestsellers}
      {bookreviews}
    </div>
  );
}
