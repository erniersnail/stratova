import type { ArticleBlock } from "@/lib/article-content";

type ArticleContentProps = {
  blocks: ArticleBlock[];
};

export default function ArticleContent({ blocks }: ArticleContentProps) {
  return (
    <div className="space-y-6">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "heading":
            return (
              <h2
                key={index}
                className="mt-10 pt-2 text-2xl font-semibold tracking-tight first:mt-0"
              >
                {block.content}
              </h2>
            );

          case "subheading":
            return (
              <h3
                key={index}
                className="mt-8 pt-2 text-xl font-medium"
              >
                {block.content}
              </h3>
            );

          case "paragraph":
            return (
              <p
                key={index}
                className="text-base leading-[1.75] text-foreground"
              >
                {block.content}
              </p>
            );

          case "list":
            return (
              <ul key={index} className="list-disc pl-6 space-y-2 text-base leading-relaxed text-foreground">
                {block.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            );

          case "ordered-list":
            return (
              <ol key={index} className="list-decimal pl-6 space-y-2 text-base leading-relaxed text-foreground">
                {block.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ol>
            );

          case "pull-quote":
            return (
              <figure key={index} className="my-10 border-l-2 border-foreground pl-6">
                <blockquote className="text-lg leading-relaxed text-foreground">
                  {block.content}
                </blockquote>
                {block.attribution && (
                  <figcaption className="mt-3 text-sm text-secondary">
                    {block.attribution}
                  </figcaption>
                )}
              </figure>
            );

          case "code":
            return (
              <pre
                key={index}
                className="overflow-x-auto rounded-md border border-border bg-[#F5F4F2] p-4 text-sm leading-relaxed"
              >
                <code>{block.content}</code>
              </pre>
            );

          case "table":
            return (
              <figure key={index} className="my-8">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        {block.headers.map((header, i) => (
                          <th
                            key={i}
                            className="px-4 py-2.5 font-medium text-secondary"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {block.rows.map((row, i) => (
                        <tr
                          key={i}
                          className="border-b border-border last:border-0"
                        >
                          {row.map((cell, j) => (
                            <td key={j} className="px-4 py-2.5 text-foreground">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {block.caption && (
                  <figcaption className="mt-3 text-xs text-tertiary">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            );

          case "figure":
            return (
              <figure
                key={index}
                className="my-8 flex items-center justify-center rounded-md border border-border bg-[#F5F4F2] py-16"
              >
                <figcaption className="px-6 text-center text-sm text-tertiary">
                  {block.caption}
                </figcaption>
              </figure>
            );

          case "math":
            return (
              <div
                key={index}
                className="my-6 rounded-md border border-border bg-[#F5F4F2] p-4 text-center font-mono text-sm leading-relaxed text-foreground"
              >
                {block.content}
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}