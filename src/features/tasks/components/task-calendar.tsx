import { useMemo, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import type { Task } from '@/features/tasks/types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type TaskCalendarProps = {
  tasks: Task[];
  onSelectTask: (task: Task) => void;
  onMoveTask: (taskId: string, dueDate: string) => void;
};

type CalendarDay = {
  date: Date;
  iso: string;
  label: string;
  fullLabel: string;
  isCurrentMonth: boolean;
  isToday: boolean;
  tasks: Task[];
};

const DAYS_OF_WEEK = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

const STATUS_COLORS: Record<Task['status'], string> = {
  todo: 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200',
  in_progress:
    'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-200',
  review:
    'bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-200',
  done: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200',
};

const MONTH_FORMATTER = new Intl.DateTimeFormat('pt-BR', {
  month: 'long',
  year: 'numeric',
});

const DAY_FORMATTER = new Intl.DateTimeFormat('pt-BR', {
  day: 'numeric',
});

const FULL_DATE_FORMATTER = new Intl.DateTimeFormat('pt-BR', {
  day: 'numeric',
  month: 'long',
});

export function TaskCalendar({
  tasks,
  onSelectTask,
  onMoveTask,
}: TaskCalendarProps) {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
  );

  const todayIso = useMemo(
    () => new Date().toISOString().split('T')[0],
    [],
  );

  const calendar = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const startOfMonth = new Date(Date.UTC(year, month, 1));
    const endOfMonth = new Date(Date.UTC(year, month + 1, 0));

    const firstDayOfCalendar = (() => {
      const dayOfWeek = startOfMonth.getUTCDay();
      const offset = dayOfWeek === 0 ? 0 : dayOfWeek;
      const date = new Date(startOfMonth);
      date.setUTCDate(date.getUTCDate() - offset);
      return date;
    })();

    const totalDays = 42;
    const days: CalendarDay[] = Array.from({ length: totalDays }, (_, index) => {
      const date = new Date(firstDayOfCalendar);
      date.setUTCDate(firstDayOfCalendar.getUTCDate() + index);

      const iso = date.toISOString().split('T')[0];
      const items = tasks
        .filter((task) => task.dueDate === iso)
        .sort((a, b) => a.title.localeCompare(b.title, 'pt-BR'));

      return {
        date,
        iso,
        label: DAY_FORMATTER.format(date),
        fullLabel: FULL_DATE_FORMATTER.format(date),
        isCurrentMonth: date >= startOfMonth && date <= endOfMonth,
        isToday: iso === todayIso,
        tasks: items,
      };
    });

    const stats = {
      overdue: tasks.filter((task) => task.dueDate < todayIso && task.status !== 'done')
        .length,
      thisWeek: tasks.filter((task) => {
        const today = new Date();
        const start = new Date(today);
        start.setDate(today.getDate() - today.getDay());
        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        return (
          task.dueDate >= start.toISOString().split('T')[0] &&
          task.dueDate <= end.toISOString().split('T')[0]
        );
      }).length,
    };

    return {
      monthLabel: MONTH_FORMATTER.format(currentDate),
      days,
      stats,
    };
  }, [currentDate, tasks, todayIso]);

  const handlePrevMonth = () => {
    setCurrentDate((prev) => {
      const next = new Date(prev);
      next.setMonth(prev.getMonth() - 1);
      return next;
    });
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => {
      const next = new Date(prev);
      next.setMonth(prev.getMonth() + 1);
      return next;
    });
  };

  const handleResetMonth = () => {
    setCurrentDate(new Date());
  };

  const handleDragStart = (event: DragStartEvent) => {
    const task = event.active.data.current?.task as Task | undefined;
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const task = active.data.current?.task as Task | undefined;

    if (task && over && typeof over.id === 'string' && over.id.startsWith('day:')) {
      const dueDate = over.id.replace('day:', '');
      if (task.dueDate !== dueDate) {
        onMoveTask(task.id, dueDate);
      }
    }

    setActiveTask(null);
  };

  return (
    <section className="space-y-4">
      <header className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary-600 dark:text-primary-300">
            Agenda de entregas
          </p>
          <h2 className="mt-1 text-2xl font-bold capitalize text-slate-900 dark:text-white">
            {calendar.monthLabel}
          </h2>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Mês anterior
          </button>
          <button
            type="button"
            onClick={handleResetMonth}
            className="rounded-full border border-primary-200 bg-primary-50 px-4 py-2 text-sm font-semibold text-primary-600 transition hover:bg-primary-100 dark:border-primary-500/50 dark:bg-primary-500/10 dark:text-primary-200"
          >
            Hoje
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Próximo mês
          </button>
        </div>
      </header>

      <div className="grid gap-3 md:grid-cols-3">
        <CalendarStat
          title="Tarefas atrasadas"
          value={calendar.stats.overdue}
          variant="danger"
        />
        <CalendarStat
          title="Entregas desta semana"
          value={calendar.stats.thisWeek}
          variant="highlight"
        />
        <CalendarStat
          title="Total no mês"
          value={tasks.length}
          variant="neutral"
        />
      </div>

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="grid grid-cols-7 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-900/60 dark:text-slate-400">
            {DAYS_OF_WEEK.map((day) => (
              <div key={day} className="px-4 py-3 text-center">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-px bg-slate-200 dark:bg-slate-800">
            {calendar.days.map((day) => (
              <CalendarDayCell
                key={day.iso}
                day={day}
                onSelectTask={onSelectTask}
              />
            ))}
          </div>
        </div>

        <DragOverlay>
          {activeTask ? (
            <DragPreview task={activeTask} />
          ) : null}
        </DragOverlay>
      </DndContext>
    </section>
  );
}

type CalendarDayCellProps = {
  day: CalendarDay;
  onSelectTask: (task: Task) => void;
};

function CalendarDayCell({ day, onSelectTask }: CalendarDayCellProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `day:${day.iso}`,
    data: {
      iso: day.iso,
    },
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex min-h-[128px] flex-col gap-2 bg-white p-3 transition dark:bg-slate-900',
        !day.isCurrentMonth &&
          'bg-slate-50 text-slate-400 dark:bg-slate-900/40 dark:text-slate-600',
        day.isToday && 'ring-2 ring-primary-400 dark:ring-primary-500',
        isOver && 'border-2 border-primary-300 bg-primary-50/60 dark:border-primary-500/40',
      )}
    >
      <div className="flex items-center justify-between text-xs font-semibold">
        <span>{day.label}</span>
        {day.tasks.length > 0 && (
          <Badge variant="outline">{day.tasks.length}</Badge>
        )}
      </div>

      <div className="space-y-1">
        {day.tasks.slice(0, 4).map((task) => (
          <CalendarTaskButton
            key={task.id}
            task={task}
            day={day}
            onSelectTask={onSelectTask}
          />
        ))}
        {day.tasks.length > 4 && (
          <p className="text-[10px] text-slate-400 dark:text-slate-500">
            +{day.tasks.length - 4} tarefas
          </p>
        )}
      </div>
    </div>
  );
}

type CalendarTaskButtonProps = {
  task: Task;
  day: CalendarDay;
  onSelectTask: (task: Task) => void;
};

function CalendarTaskButton({
  task,
  day,
  onSelectTask,
}: CalendarTaskButtonProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `task:${task.id}`,
      data: { task },
    });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <button
      ref={setNodeRef}
      type="button"
      style={style}
      onClick={() => onSelectTask(task)}
      title={`${task.title} • ${day.fullLabel}`}
      className={cn(
        'flex w-full items-center justify-between rounded-xl px-2 py-1 text-[11px] font-semibold transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 dark:focus-visible:ring-primary-500',
        STATUS_COLORS[task.status],
        isDragging && 'opacity-80 ring-2 ring-primary-300 dark:ring-primary-500',
      )}
      {...listeners}
      {...attributes}
    >
      <span className="truncate">{task.title}</span>
    </button>
  );
}

function DragPreview({ task }: { task: Task }) {
  return (
    <div
      className={cn(
        'rounded-xl px-3 py-2 text-[11px] font-semibold text-white shadow-lg',
        'bg-primary-600',
      )}
    >
      {task.title}
    </div>
  );
}

type CalendarStatProps = {
  title: string;
  value: number;
  variant: 'danger' | 'highlight' | 'neutral';
};

function CalendarStat({ title, value, variant }: CalendarStatProps) {
  const variantClass =
    variant === 'danger'
      ? 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-200'
      : variant === 'highlight'
        ? 'border-primary-200 bg-primary-50 text-primary-600 dark:border-primary-500/30 dark:bg-primary-500/10 dark:text-primary-200'
        : 'border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200';

  return (
    <div
      className={cn(
        'rounded-3xl border px-5 py-4 shadow-sm transition',
        variantClass,
      )}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.3em]">{title}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
      <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
        {variant === 'danger'
          ? 'Priorize estas tarefas.'
          : variant === 'highlight'
            ? 'Organize a semana para garantir as entregas.'
            : 'Agenda consolidada do mês atual.'}
      </p>
    </div>
  );
}
