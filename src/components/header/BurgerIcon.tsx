import classNames from 'classnames';

export const BurgerIcon = ({ open }) => {
  const barClassName =
    'bm-burger-icon w-7 h-1 rounded transition-all ease-linear relative bg-black transform';
  return (
    <div className="w-7 h-7 cursor-pointer flex flex-col justify-around">
      <div
        className={classNames(barClassName, {
          'rotate-45': open,
          'rotate-0': !open
        })}
      />
      <div
        className={classNames(barClassName, {
          'opacity-0 translate-x-2': open,
          'opacity-1 translate-x-0': !open
        })}
      />
      <div
        className={classNames(barClassName, {
          '-rotate-45': open,
          'rotate-0': !open
        })}
      />
    </div>
  );
};
