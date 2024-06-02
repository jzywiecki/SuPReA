const ProjectView = () => {
  return (
    <div className="flex h-screen bg-gray-200">
      <div className="w-1/4 bg-white p-4">
        <h2 className="font-bold mb-4">Lista treści</h2>
        <ul>
          <li className="mb-2">Treść 1</li>
          <li className="mb-2">Treść 2</li>
          <li className="mb-2">Treść 3</li>
        </ul>
      </div>
      <div className="w-1/2 bg-gray-300 p-4">
        <h2 className="font-bold mb-4">Widok projektu</h2>
        {/* Tutaj umieść zawartość projektu */}
      </div>
      <div className="w-1/4 bg-white p-4">
        <h2 className="font-bold mb-4">Chat</h2>
        <div className="border border-gray-300 p-2 mb-2">Wiadomość 1</div>
        <div className="border border-gray-300 p-2 mb-2">Wiadomość 2</div>
        <input type="text" className="border border-gray-300 p-2 w-full" placeholder="Napisz wiadomość..." />
      </div>
    </div>
  );
};

export default ProjectView;