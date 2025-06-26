function Welcome() {
  const username = localStorage.getItem('username') || 'Trader';

  return (
    <div className="h-full flex flex-col items-center justify-center text-white text-center px-4">
      <h2 className="text-4xl font-bold mb-4">Welcome, {username} 👋</h2>
      <p className="text-lg">
        Ready to track your bots and trades? Use the navigation above to get started.
      </p>
    </div>
  );
}

export default Welcome;
