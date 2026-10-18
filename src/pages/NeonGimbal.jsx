/* Neon 3D camera gimbal, ad creative.
   A handheld 3-axis stabilizer built from CSS 3D cuboids and cylinders:
   handle -> yaw motor -> roll motor -> U-frame -> pitch motors -> camera + lens.
   No libraries. Styles live in CustomerDashboard.css (.gimbal, .gb-*).
   Hover the diagram to freeze it; hover a label to light up its part. */

function Box({ w, h, d, x = 0, y = 0, z = 0, tone = "cyan", part = "" }) {
  const faces = [
    { width: w, height: h, left: -w / 2, top: -h / 2, transform: `translateZ(${d / 2}px)` },
    { width: w, height: h, left: -w / 2, top: -h / 2, transform: `rotateY(180deg) translateZ(${d / 2}px)` },
    { width: d, height: h, left: -d / 2, top: -h / 2, transform: `rotateY(90deg) translateZ(${w / 2}px)` },
    { width: d, height: h, left: -d / 2, top: -h / 2, transform: `rotateY(-90deg) translateZ(${w / 2}px)` },
    { width: w, height: d, left: -w / 2, top: -d / 2, transform: `rotateX(90deg) translateZ(${h / 2}px)` },
    { width: w, height: d, left: -w / 2, top: -d / 2, transform: `rotateX(-90deg) translateZ(${h / 2}px)` },
  ];

  return (
    <div
      className={`gb gb-${tone} ${part}`}
      style={{ transform: `translate3d(${x}px, ${y}px, ${z}px)` }}
    >
      {faces.map((style, i) => (
        <i key={i} style={style} />
      ))}
    </div>
  );
}

/* Cylinder standing on the Y axis. axis="x" or "z" lays it down. */
function Cyl({ r, h, x = 0, y = 0, z = 0, axis = "y", tone = "cyan", sides = 12, part = "" }) {
  const width = 2 * r * Math.sin(Math.PI / sides);
  const apothem = r * Math.cos(Math.PI / sides);
  const lay = axis === "x" ? "rotateZ(90deg)" : axis === "z" ? "rotateX(90deg)" : "";

  return (
    <div
      className={`gb gb-${tone} ${part}`}
      style={{ transform: `translate3d(${x}px, ${y}px, ${z}px) ${lay}` }}
    >
      {Array.from({ length: sides }, (_, i) => (
        <i
          key={i}
          style={{
            width,
            height: h,
            left: -width / 2,
            top: -h / 2,
            transform: `rotateY(${(i * 360) / sides}deg) translateZ(${apothem}px)`,
          }}
        />
      ))}
      <i
        className="gb-cap"
        style={{ width: 2 * r, height: 2 * r, left: -r, top: -r, transform: `rotateX(90deg) translateZ(${h / 2}px)` }}
      />
      <i
        className="gb-cap"
        style={{ width: 2 * r, height: 2 * r, left: -r, top: -r, transform: `rotateX(-90deg) translateZ(${h / 2}px)` }}
      />
    </div>
  );
}

/* Thin glowing axis guide. Two crossed planes so it never vanishes edge-on. */
function Axis({ dir, len, x = 0, y = 0, z = 0, tone = "violet" }) {
  const vertical = dir === "y";
  const rots =
    dir === "x"
      ? ["", "rotateX(90deg)"]
      : dir === "y"
      ? ["", "rotateY(90deg)"]
      : ["rotateY(90deg)", "rotateY(90deg) rotateX(90deg)"];

  return (
    <div
      className={`gb gb-axis gb-${tone}`}
      style={{ transform: `translate3d(${x}px, ${y}px, ${z}px)` }}
    >
      {rots.map((transform, i) => (
        <i
          key={i}
          style={{
            width: vertical ? 1 : len,
            height: vertical ? len : 1,
            left: vertical ? -0.5 : -len / 2,
            top: vertical ? -len / 2 : -0.5,
            transform,
            background: `linear-gradient(${vertical ? "180deg" : "90deg"}, transparent, var(--c) 16%, var(--c) 84%, transparent)`,
          }}
        />
      ))}
    </div>
  );
}

function NeonGimbal() {
  return (
    <div
      className="gimbal"
      role="img"
      aria-label="Neon 3D camera gimbal, ad creative"
    >
      <span className="gimbal-tag">AD CREATIVE</span>

      <div className="gimbal-scene">
        <div className="gb-center">
          <div className="gb-spin">
            <div className="gb-floor" />
            <div className="gb-floor gb-floor-inner" />
            <Axis dir="y" len={330} y={50} tone="violet" />

            {/* handle: grip, ridges, collar, pommel, trigger and joystick */}
            <Cyl r={17} h={96} y={154} tone="cyan" />
            {[140, 152, 164, 176].map((y) => (
              <Cyl key={y} r={18.5} h={3} y={y} tone="frame" />
            ))}
            <Cyl r={20} h={8} y={116} tone="cyan" />
            <Cyl r={20} h={10} y={199} tone="violet" />
            <Box w={10} h={22} d={7} y={150} z={21} tone="blue" />
            <Cyl r={5} h={5} y={128} z={21} axis="z" tone="violet" />

            {/* yaw motor (fixed on the handle) */}
            <Cyl r={24} h={24} y={94} tone="violet" part="g-yaw" />

            {/* everything above the yaw motor swings on the yaw axis */}
            <div className="gb-grp gb-yaw-grp">
              <Box w={14} h={22} d={14} y={70} tone="frame" />
              <Axis dir="z" len={190} y={50} tone="blue" />

              {/* roll motor, axis along the lens direction */}
              <Cyl r={17} h={22} y={50} axis="z" tone="blue" part="g-roll" />

              {/* U-frame and camera tilt on the roll axis */}
              <div className="gb-grp gb-roll-grp">
                <Box w={140} h={10} d={14} y={28} tone="frame" />
                <Box w={10} h={68} d={14} x={-64} y={-6} tone="frame" />
                <Box w={10} h={68} d={14} x={64} y={-6} tone="frame" />
                <Axis dir="x" len={200} y={-40} tone="cyan" />

                {/* pitch motors, axis through both sides of the camera */}
                <Cyl r={14} h={14} x={-55} y={-40} axis="x" tone="cyan" part="g-pitch" />
                <Cyl r={14} h={14} x={55} y={-40} axis="x" tone="cyan" part="g-pitch" />

                {/* camera and lens nod on the pitch axis */}
                <div className="gb-grp gb-pitch-grp">
                  <Box w={90} h={58} d={60} y={-40} tone="cyan" />
                  <Box w={24} h={10} d={26} y={-74} z={-8} tone="cyan" />
                  <Box w={14} h={3} d={14} y={-81.5} z={-8} tone="frame" />
                  <Box w={58} h={34} d={4} y={-40} z={-32} tone="violet" />
                  <Box w={5} h={5} d={2} x={34} y={-62} z={31} tone="violet" part="gb-led" />

                  <Cyl r={24} h={10} y={-40} z={35} axis="z" tone="cyan" part="g-lens" />
                  <Cyl r={20} h={30} y={-40} z={55} axis="z" tone="cyan" part="g-lens" />
                  <Cyl r={22} h={3} y={-40} z={50} axis="z" tone="frame" />
                  <Cyl r={22} h={3} y={-40} z={58} axis="z" tone="frame" />
                  <Cyl r={26} h={12} y={-40} z={75} axis="z" tone="violet" sides={14} part="g-lens" />
                  <div
                    className="gb gb-cyan g-lens"
                    style={{ transform: "translate3d(0px, -40px, 82px)" }}
                  >
                    <i className="gb-glass" style={{ width: 38, height: 38, left: -19, top: -19 }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <span className="gimbal-label gimbal-label-1">
        <b className="lb-violet">01</b>
        <em>Yaw motor</em>
        <i />
      </span>
      <span className="gimbal-label gimbal-label-2">
        <b className="lb-blue">02</b>
        <em>Roll motor</em>
        <i />
      </span>
      <span className="gimbal-label gimbal-label-3">
        <b>03</b>
        <em>Pitch motor</em>
        <i />
      </span>
      <span className="gimbal-label gimbal-label-4">
        <b>04</b>
        <em>Lens</em>
        <i />
      </span>

      <span className="gimbal-readout">YAW ±28° · ROLL ±9° · PITCH ±14°</span>
    </div>
  );
}

export default NeonGimbal;