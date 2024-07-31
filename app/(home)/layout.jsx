export default function HomeLayout({ bestsellers, bookreviews }) {
  return (
    <div className="w-11/12">
      {bestsellers}
      {bookreviews}
    </div>
  );
}
