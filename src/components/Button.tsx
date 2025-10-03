import React from 'react';

function Button({
  imgSrc,
  name,
  onClick,
}: {
  imgSrc: string;
  name: string;
  onClick: () => void;
}) {
  return (
    <div
      className="flex-1 min-w-0 flex items-center justify-center cursor-pointer"
      onClick={onClick}
    >
      <img className="w-12" src={imgSrc} alt={name} />
    </div>
  );
}

export default Button;
