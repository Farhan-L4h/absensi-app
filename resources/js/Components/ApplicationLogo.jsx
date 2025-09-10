export default function ApplicationLogo(props) {
    return (
        <div className="flex items-center space-x-2" {...props}>
            <div className="text-3xl">📝</div>
            <div className="text-center">
                <div className="text-lg font-bold text-current">Sistem Absensi</div>
                <div className="text-xs text-current opacity-75">Digital Modern</div>
            </div>
        </div>
    );
}
