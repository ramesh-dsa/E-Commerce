const fs = require('fs');

let content = fs.readFileSync('src/app/orders/[id]/page.tsx', 'utf8');

// 1. Add variants
const variantsCode = `
const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};
`;
content = content.replace('export default function OrderDetailPage', variantsCode + '\nexport default function OrderDetailPage');

// 2. Change wrapper grid
content = content.replace(
  '<div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">',
  '<motion.div variants={containerVariants} initial="hidden" animate="show" className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">\n<div className="lg:col-span-8 space-y-8">'
);

// 3. Close left col and open right col
// Locate the end of Order Items
content = content.replace(
  '</section>\n\n        {/* ── PRICE BREAKDOWN + DELIVERY + PAYMENT (Two Column) ────────────── */}\n        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">',
  '</motion.section>\n        </div>\n\n        {/* ── RIGHT COLUMN: PRICE BREAKDOWN + DELIVERY + PAYMENT ────────────── */}\n        <div className="lg:col-span-4 space-y-6">'
);

// 4. Wrap sections in itemVariants
content = content.replace(/<section className="bg-white/g, '<motion.section variants={itemVariants} className="bg-white');
content = content.replace(/<\/section>/g, '</motion.section>');
content = content.replace(
  '<section className="bg-[#fafafa] border border-[#e8e8e5] rounded-xl p-5 sm:p-6">',
  '<motion.section variants={itemVariants} className="bg-[#fafafa] border border-[#e8e8e5] rounded-xl p-5 sm:p-6">'
);

// Hero card replace
content = content.replace(
  '<div className="relative bg-[#111111] text-white rounded-xl p-6 sm:p-8 overflow-hidden animate-in fade-in slide-in-from-top-3 duration-500 shadow-2xl">',
  '<motion.div variants={itemVariants} className="relative bg-[#111111] text-white rounded-xl p-6 sm:p-8 overflow-hidden shadow-2xl">'
);
content = content.replace(
  '<section className="bg-red-50/70 border border-red-200/80 rounded-xl p-5 sm:p-7 relative overflow-hidden">',
  '<motion.section variants={itemVariants} className="bg-red-50/70 border border-red-200/80 rounded-xl p-5 sm:p-7 relative overflow-hidden">'
);

// 5. Progress bar animation
content = content.replace(
  '<div\n                  className="absolute top-5 left-[10%] h-[3px] bg-[#111111] rounded-full transition-all duration-700 ease-out"\n                  style={{\n                    width: `${currentStepIndex >= 0 ? (currentStepIndex / (TIMELINE_STEPS.length - 1)) * 80 : 0}%`,\n                  }}\n                  aria-hidden="true"\n                />',
  '<motion.div\n                  initial={{ width: 0 }}\n                  animate={{ width: `${currentStepIndex >= 0 ? (currentStepIndex / (TIMELINE_STEPS.length - 1)) * 80 : 0}%` }}\n                  transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}\n                  className="absolute top-5 left-[10%] h-[3px] bg-[#111111] rounded-full"\n                  aria-hidden="true"\n                />'
);

// 6. Timeline nodes animation
content = content.replace(
  '                      <div\n                        className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300',
  '                      <motion.div\n                        initial={{ scale: 0, opacity: 0 }}\n                        animate={{ scale: 1, opacity: 1 }}\n                        transition={{ delay: 0.2 + (idx * 0.15), type: "spring", stiffness: 300, damping: 20 }}\n                        className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300'
);
// replace closing div for the node
content = content.replace(/                        \{TIMELINE_ICONS\[step\]\}\n                      <\/div>/g, '                        {TIMELINE_ICONS[step]}\n                      </motion.div>');

// 7. Image hover effect
const oldImage = `<Image
                      src={item.imageUrl}
                      alt={item.productName}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />`;
const newImage = `<motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }} className="w-full h-full">\n<Image src={item.imageUrl} alt={item.productName} fill className="object-cover" sizes="80px" />\n</motion.div>`;
content = content.replace(oldImage, newImage);

// 8. Fix the closing grid div (Need Help + Security is below the grid)
// We need to change the closing of `max-w-4xl` to `</motion.div>` but wait, it was changed to `<motion.div>` in step 2.
// Let's locate the `Need Help + Security` block.
content = content.replace(
  '          </div>\n        </div>\n\n        {/* ── NEED HELP + SECURITY ──────────────────────────────────────────── */}',
  '          </div>\n        </motion.div>\n\n        <div className="max-w-6xl mx-auto px-4 sm:px-6">\n        {/* ── NEED HELP + SECURITY ──────────────────────────────────────────── */}'
);
content = content.replace(
  '            <span>Back to All Orders</span>\n          </Link>\n        </div>\n      </div>',
  '            <span>Back to All Orders</span>\n          </Link>\n        </div>\n      </div>'
); // wait, the outer div of the whole page remains the same.

fs.writeFileSync('src/app/orders/[id]/page.tsx', content);
console.log("Updated successfully");
