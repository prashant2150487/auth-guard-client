const UsersLoader = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-sm text-slate-500">
      <div className="mb-3 h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />
      <p>{message}</p>
    </div>
  );
};

export default UsersLoader;


