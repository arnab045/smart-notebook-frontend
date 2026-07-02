function DashboardCard({

  title,
  description,
  icon,
}) {

  return (

    <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">

      <div className="text-5xl mb-5">

        {icon}

      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-3">

        {title}

      </h2>

      <p className="text-gray-500 leading-relaxed">

        {description}

      </p>

    </div>
  )
}

export default DashboardCard