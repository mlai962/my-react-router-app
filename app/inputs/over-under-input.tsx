export default function OverUnderInput() {
  return (
    <div>
      <button>O</button>
      <button>U</button>
      <input type="number" step="0.5" min="0.5" defaultValue="0.5" />
    </div>
  );
}
