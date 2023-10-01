export default function HomeLayout({ bestsellers, bookreviews }) {
  return (
    <div className="w-full">
      {bestsellers}
      {bookreviews}
    </div>
  );
}
