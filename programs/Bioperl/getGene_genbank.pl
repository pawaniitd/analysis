#!C:/Perl64/bin/perl

use lib qw(C:/Perl64/site/lib);
use Bio::SeqIO;
use Bio::Seq;
use DBI;
use DBD::Pg;

my $geneID = undef;	#Gene - ID
my $locus_tag = undef;	#Gene - locus_tag
my $name = undef;	#Gene - name
my $location_start = undef;	#Gene - location start
my $location_end = undef;	#Gene - location end
my $seq = undef;	#Gene - sequence
my $protein_id = undef;	#Gene - protein id
my $protein_seq = undef;	#Gene - protein sequence
my $gene_type = undef;	#Gene - type (Protein or RNA)


$inputFile = "F:/Eumentis/Tb/Analysis/NCBI/H37Rv.gb";
$format = "genbank";
 
$seqIO = Bio::SeqIO->new(-file => "<$inputFile" ,
                      -format => $format);
					  
$sequence = $seqIO->next_seq();

$search_gene = $ARGV[0];

$check = 0;
$error = "Error";

#	get_tag_values() function returns array
#	get_SeqFeatures() function returns array

for my $feature ($sequence->get_SeqFeatures()) {

	if ($feature->primary_tag() eq 'CDS') {
	
		if ($feature->has_tag('gene')) {
		
			for my $gene_name ($feature->get_tag_values('gene')) {	#Gene name
			
				if (lc($gene_name) eq lc($search_gene)) {
				
					$check = 1;
				
					$name = $gene_name;
					
					for my $id ($feature->get_tag_values('db_xref')) {
						my @values = split(':', $id);
						if (lc($values[0]) eq 'geneid') {
							$geneID = $values[1];
						}
					}
					
					my @tags = $feature->get_tag_values('locus_tag');
					$locus_tag = $tags[0];	#Gene locus_tag
					
					$location_start = $feature->start();	#Gene - location start
					
					$location_end = $feature->end();	#Gene - location end
					
					$seq = $feature->seq()->seq();	#Gene - sequence
					
					my @protein = $feature->get_tag_values('protein_id');
					$protein_id = $protein[0];	#Gene - protein id
					
					my @proSeq = $feature->get_tag_values('translation');
					$protein_seq = $proSeq[0];	#Gene - protein sequence
					
					$gene_type = "Protein";
					
					last;
				}
			}
		}
	}
	
	if ($feature->primary_tag() eq 'rRNA') {
		
		if ($feature->has_tag('gene')) {
		
			for my $gene_name ($feature->get_tag_values('gene')) {	#Gene name
			
				if (lc($gene_name) eq lc($search_gene)) {
					
					$check = 1;
					
					$name = $gene_name;
					
					for my $id ($feature->get_tag_values('db_xref')) {
						my @values = split(':', $id);
						if (lc($values[0]) eq 'geneid') {
							$geneID = $values[1];
						}
					}
					
					my @tags = $feature->get_tag_values('locus_tag');
					$locus_tag = $tags[0];	#Gene locus_tag
					
					$location_start = $feature->start();	#Gene - location start
					
					$location_end = $feature->end();	#Gene - location end
					
					$seq = $feature->seq()->seq();	#Gene - sequence
					
					$gene_type = "RNA";
					
					last;
				}
			}
		}
	}
}

if ($check == 1) {
	$dbname = "eumentis_tb_papers";
	$user = "pawn";
	$pass = "ppppp";

	$dbh = DBI->connect("dbi:Pg:dbname=$dbname", $user, $pass, {AutoCommit => 0}) or die $DBI::errstr;

	$table = "h37rv_genes";

	$sth = $dbh->prepare("INSERT INTO $table (id, locus_tag, name, location_start, location_stop, seq, protein_id, protein_seq, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)") or die $DBI::errstr;
	$sth->execute($geneID, $locus_tag, $name, $location_start, $location_end, $seq, $protein_id, $protein_seq, $gene_type) or die $DBI::errstr;

	$sth->finish();
	$dbh->commit or die $DBI::errstr;
	$dbh->disconnect();

	print "Success";
}
else {
	print $error;
}