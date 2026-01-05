import cn from '../utils/class-names';

/**
 * Reusable form wrapper component for horizontal layout
 * Left side: Title and description
 * Right side: Form fields
 */
export default function HorizontalFormBlockWrapper({
  title,
  description,
  children,
  className,
  isModalView = true,
}) {
  return (
    <div
      className={cn(
        className,
        isModalView ? 'grid grid-cols-1 lg:grid-cols-6' : ''
      )}
    >
      {isModalView && (
        <div className="col-span-1 lg:col-span-2 mb-6 pr-4 lg:mb-0">
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        </div>
      )}

      <div
        className={cn(
          'grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6',
          isModalView ? 'col-span-1 lg:col-span-4' : ''
        )}
      >
        {children}
      </div>
    </div>
  );
}
