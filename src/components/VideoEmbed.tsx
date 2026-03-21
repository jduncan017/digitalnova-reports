export function VideoEmbed({
  url,
  title,
}: {
  url: string;
  title?: string;
}) {
  // Convert supercut share URL to embed URL
  // https://supercut.ai/share/org/id → https://supercut.ai/embed/org/id?embed=full
  const embedUrl = url.replace("/share/", "/embed/") + "?embed=full";

  return (
    <div
      className="mb-12 overflow-hidden rounded-2xl"
      style={{ border: "1px solid var(--border)" }}
    >
      <div style={{ position: "relative", paddingBottom: "82%" }}>
        <iframe
          allow="clipboard-write; encrypted-media; picture-in-picture"
          allowFullScreen
          src={embedUrl}
          title={title ?? "Video Review"}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            top: 0,
            left: 0,
            border: "none",
          }}
        />
      </div>
    </div>
  );
}
